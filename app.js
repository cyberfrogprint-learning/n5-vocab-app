let vocab = [];
let filtered = [];
let current = 0;

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRtC4KU4o9VQ37slwlM4oNFgg76etlvM-z8kscz35G7GbEwV4VmSGqNiupxA0KHGWP0osMemE27_OOy/pub?output=csv";

fetch(SHEET_URL)
  .then(res => res.text())
  .then(csv => {
    let rows = csv.split("\n").slice(1);

    vocab = rows.map(row => {
      let cols = row.split(",");
      return {
        jp: cols[0],
        vi: cols[1],
        lesson: cols[2]
      };
    });

    filtered = [...vocab];
    render();
    loadQuiz();
  });
