export function generatePublicProductURL({ folio, tienda }) {
  const protocol = window.location.protocol;
  const domain =
    window.location.hostname !== "localhost"
      ? window.location.hostname
      : window.location.host;
  return `${protocol}//${domain}/commerce/${tienda}/productos/${folio}`;
}
