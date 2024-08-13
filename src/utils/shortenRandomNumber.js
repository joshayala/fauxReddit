/**
 * Shorten number to thousands, millions, billions, etc.
 * Source: https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
  ** Edited Agust 2024
    @param {number} num Number to shorten
  @param {number} digits The number of digits to appear after the decimal point.
 */



  export default function shortenNumber(num, digits = 2) {
    // Define units for each magnitude of the number
    const units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  
    // If num is 0, simply return it
    if (num === 0) return '0';
  
    // Check if num is negative and handle the absolute value
    const sign = Math.sign(num);
    num = Math.abs(num);
  
    // Iterate through units from largest to smallest
    for (let i = units.length - 1; i >= 0; i -= 1) {
      const decimal = 1000 ** (i + 1);
  
      if (num >= decimal) {
        // Calculate the shortened number and add the unit suffix
        const shortenedNum = +(num / decimal).toFixed(digits);
        return (sign * shortenedNum) + units[i];
      }
    }
  
    // Return the number as-is if it doesn't require shortening
    return num.toFixed(digits);
  }
  