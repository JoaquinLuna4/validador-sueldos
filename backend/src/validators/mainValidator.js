const { validateBasic } = require("./basicValidator");
const { validateSantander } = require("./banks/santanderValidator");
const { validateGalicia } = require("./banks/galiciaValidator");

/**
 * Orquesta el proceso de validación según el plan del usuario.
 * @param {string} fileContent - El contenido del archivo.
 * @param {string} plan - 'basic' o 'premium'.
 * @param {string} [bank] - El banco para la validación premium (ej: 'santander', 'galicia').
 * @returns {object} - El resultado de la validación.
 */
function validateFile(fileContent, plan, bank = null) {
	if (plan === "basic") {
		const result = validateBasic(fileContent);
		result.bank = "Genérico";
		return result;
	}

	if (plan === "premium") {
		if (!bank) {
			return {
				bank: "Error",
				errorCount: 1,
				errors: [
					{
						line: 0,
						message: "Se requiere un banco para la validación premium.",
					},
				],
			};
		}
		switch (bank) {
			case "santander":
				return validateSantander(fileContent);
			case "galicia":
				return validateGalicia(fileContent);
			default:
				return {
					bank: "Error",
					errorCount: 1,
					errors: [
						{
							line: 0,
							message: `El banco '${bank}' no está soportado para validación premium.`,
						},
					],
				};
		}
	}

	return {
		bank: "Error",
		errorCount: 1,
		errors: [
			{ line: 0, message: `El plan de validación '${plan}' no es válido.` },
		],
	};
}

module.exports = {
	validateFile,
};
