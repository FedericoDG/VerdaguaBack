const randomCode = () => {
  let string = '';
  let num = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  const numbers = '1234567890';
  const numbersLength = numbers.length;
  let counter = 0;
  while (counter < 3) {
    string += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  let counter2 = 0;
  while (counter2 < 3) {
    num += numbers.charAt(Math.floor(Math.random() * numbersLength));
    counter2 += 1;
  }
  return string + '-' + num;
};

module.exports = randomCode;
