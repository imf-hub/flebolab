"""Check published catalog URLs with HEAD; never download the clinical bank."""
import argparse
import concurrent.futures
import json
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


def collect(value, paths):
    if isinstance(value, str) and value.startswith('/media/'):
        paths.add(value)
    elif isinstance(value, list):
        for child in value:
            collect(child, paths)
    elif isinstance(value, dict):
        for child in value.values():
            collect(child, paths)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', default='https://imf-hub.github.io/flebolab/')
    parser.add_argument('--output', default='docs/qa/0.10/public-assets.json')
    args = parser.parse_args()
    base = args.base.rstrip('/')
    if urllib.parse.urlparse(base).scheme != 'https':
        parser.error('Use an HTTPS publication URL.')
    paths = set()
    for name in ['assets', 'dus', 'vision', 'waterloo', 'educational-content']:
        collect(json.loads(Path(f'src/data/{name}.json').read_text(encoding='utf-8')), paths)
    paths.update(['/favicon.svg', '/references/flebolab-vancouver.txt', '/references/flebolab.bib'])

    def check(path):
        url = base + urllib.parse.quote(path, safe='/')
        for attempt in range(2):
            try:
                request = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'FLEBOLAB-publication-check/0.10'})
                with urllib.request.urlopen(request, timeout=15) as response:
                    return {'path': path, 'status': response.status, 'type': response.headers.get('Content-Type'), 'bytes': response.headers.get('Content-Length')}
            except (urllib.error.URLError, TimeoutError) as error:
                if attempt:
                    return {'path': path, 'status': getattr(error, 'code', None), 'error': str(error)}
                time.sleep(.5)

    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for result in pool.map(check, sorted(paths)):
            results.append(result)
            if len(results) % 200 == 0:
                print(f'{len(results)}/{len(paths)} URLs checked', flush=True)
    failures = [item for item in results if item['status'] != 200]
    report = {'base': base, 'method': 'HEAD; no media bodies downloaded', 'checked': len(results), 'passed': len(results)-len(failures), 'failures': failures, 'results': results}
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print(json.dumps({key: report[key] for key in ['base', 'checked', 'passed', 'failures']}, ensure_ascii=False))
    raise SystemExit(bool(failures))


if __name__ == '__main__':
    main()
