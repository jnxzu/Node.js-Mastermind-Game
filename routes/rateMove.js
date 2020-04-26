module.exports = {
  rateMove: function (ruch, rated, answer) {
    let ruchRated = [];
    let black = 0;
    let white = 0;
    for (let i = 0; i < ruch.length; i++) {
      ruchRated[i] = false;
    }
    for (let i = 0; i < ruch.length; i++) {
      if (rated[i]) continue;
      if (ruch[i] === answer[i]) {
        ruchRated[i] = true;
        rated[i] = true;
        black++;
      }
    }
    for (let i = 0; i < ruch.length; i++) {
      if (ruchRated[i]) continue;
      for (let j = 0; j < answer.length; j++) {
        if (rated[j]) continue;
        if (ruch[i] === answer[j]) {
          ruchRated[i] = true;
          rated[j] = true;
          white++;
        }
      }
    }
    return [rated, black, white];
  },
};
