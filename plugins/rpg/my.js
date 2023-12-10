export default {
  name: "my",
  command: ["my", "limit"],
  tags: ["rpg"],
  desc: "Check Balance, limit",
  run: async (m, { conn }) => {
    let user = db.users[m.sender];
    var teks = `*乂  L I M I T  &  M O N E Y*

  *◦ Limit :* ${user.limit}
  *◦ Balance :* Rp ${toRupiah(user.balance)}
  *◦ Poin :* ${user.point}
  *◦ Premium :* [ *${user.premium ? "√" : "×"}* ]
`;
    m.reply(teks);
  },
};

function toRupiah(angka) {
  var balancenyeini = "";
  var angkarev = angka.toString().split("").reverse().join("");
  for (var i = 0; i < angkarev.length; i++)
    if (i % 3 == 0) balancenyeini += angkarev.substr(i, 3) + ".";
  return (
    "" +
    balancenyeini
      .split("", balancenyeini.length - 1)
      .reverse()
      .join("")
  );
}
