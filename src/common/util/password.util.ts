import {hashSync} from "bcrypt";

export function randomPassword(length: number) {
  let result = "";
  const characters =
    "@#$-+*!ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return {
    password: result,
    hashed: hashSync(result, 12),
  };
}
export function hashPassword(data: string) {
  return hashSync(data, 12);
}
