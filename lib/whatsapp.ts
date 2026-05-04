export function generateWhatsAppUrl(number: string, message: string): string {
  const cleanNumber = number.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export function generateProductWhatsAppMessage(
  productName: string,
  price: number | string,
  baseTemplate?: string,
  overrideMessage?: string | null,
  productUrl?: string
): string {
  const replacements = (template: string) =>
    template
      .replaceAll('{productName}', productName)
      .replaceAll('{price}', price.toString())
      .replaceAll('{productUrl}', productUrl || '');

  if (overrideMessage) {
    return replacements(overrideMessage);
  }

  if (baseTemplate) {
    return replacements(baseTemplate);
  }

  return `Hola! Me interesa el producto: ${productName} - Precio: $${price} ARS. Esta disponible?${productUrl ? ` Link: ${productUrl}` : ''}`;
}
