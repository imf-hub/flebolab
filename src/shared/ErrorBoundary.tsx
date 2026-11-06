import { Component, type ReactNode } from "react";
export default class ErrorBoundary extends Component<
  { children: ReactNode; message?: string },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="empty-state" role="alert">
        <h3>{this.props.message ?? "No se pudo abrir esta vista."}</h3>
        <p>Puedes volver a cargarla o continuar en otro laboratorio.</p>
        <button className="button primary" onClick={() => location.reload()}>
          Volver a cargar
        </button>
        <a href={import.meta.env.BASE_URL} className="text-link">
          Volver a los laboratorios
        </a>
      </div>
    ) : (
      this.props.children
    );
  }
}
