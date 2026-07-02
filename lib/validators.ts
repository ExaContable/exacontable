export function validarCedula(cedula: string): boolean {
  if (!/^\d{10}$/.test(cedula)) return false;

  const provincia = parseInt(cedula.substring(0, 2), 10);
  if (provincia < 1 || provincia > 24) return false;

  const digitoVerificador = parseInt(cedula[9], 10);
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let digito = parseInt(cedula[i], 10);
    if (i % 2 === 0) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    suma += digito;
  }

  return (10 - (suma % 10)) % 10 === digitoVerificador;
}

export function validarRUC(ruc: string): boolean {
  if (!/^\d{13}$/.test(ruc)) return false;

  const cedula = ruc.substring(0, 10);
  if (!validarCedula(cedula)) return false;

  const ultimosDigitos = ruc.substring(10);
  if (ultimosDigitos !== "001") return false;

  return true;
}

export function validarRucOCedula(valor: string): "ruc" | "cedula" | false {
  if (valor.length === 10 && validarCedula(valor)) return "cedula";
  if (valor.length === 13 && validarRUC(valor)) return "ruc";
  return false;
}
