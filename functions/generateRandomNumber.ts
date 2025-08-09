export function generateRandomThreeDigitNumber(): string {
    const randomNumber = Math.floor(Math.random() * 900) + 100; // Generates a number between 100 and 999
    return randomNumber.toString(); // Convert the number to a string
}