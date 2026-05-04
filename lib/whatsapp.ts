export function generateWhatsAppUrl(number: string, message: string): string {
  const cleanNumber = number.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export function generateProductWhatsAppMessage(
  productName: string,
  price: number | string,
  baseTemplate?: string,
  overrideMessage?: string | null
): string {
  if (overrideMessage) {
    return overrideMessage
      .replace('{productName}', productName)
      .replace('{price}', price.toString());
  }

  if (baseTemplate) {
    return baseTemplate
      .replace('{productName}', productName)
      .replace('{price}', price.toString());
  }

  return `Hola! Me interesa el producto: ${productName} - Precio: $${price} ARS. Esta disponible?`;
}
