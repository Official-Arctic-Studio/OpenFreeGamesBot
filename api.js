const fetch = require("node-fetch");
const db_handler = require("./modules/db_handler");

getGames();

function getGames() {
  fetch("https://www.epicgames.com/store/backend/static/freeGamesPromotions")
    .then((res) => res.json())
    .then((data) => data.data.Catalog.searchStore.elements)
    .then((games) => {
      let array = [];
      for (game of games) {
        if (
          game.price.totalPrice.discountPrice == 0 //&&
          // game.price.totalPrice.discountPrice !=
          //   game.price.totalPrice.originalPrice
        ) {
          const Store = "Epic";
          const Name = game.title;
          const State = "Free Game";
          const URL = `https://www.epicgames.com/store/en-US/p/${game.productSlug}`;
          let Image = "";
          for (image of game.keyImages) {
            if (image.type == "DieselStoreFrontWide") Image = image.url;
          }
          if (game.promotions == null) continue;
          if (game.promotions.promotionalOffers[0] == undefined) continue;
          const endDate =
            game.promotions.promotionalOffers[0].promotionalOffers[0].endDate;
          let date = new Date(endDate);
          const TimeLeft = date.toLocaleString("default", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            timeZone: "UTC",
            timeZoneName: "short",
            formatMatcher: "best fit",
          });
          console.log(Store, Name, State, URL, Image, TimeLeft);
          array.push([Store, Name, TimeLeft, URL, Image, State]);
        }
      }
      db_handler.delete("`games`", '`Store`="Epic"').then(() => {
        for (game of array) {
          db_handler.insert(
            "`games`",
            "(`Store`, `Name`, `TimeLeft`, `Link`, `Image`, `State`)",
            `("${game[0]}", "${game[1]}", "${game[2]}", "${game[3]}", "${game[4]}", "${game[5]}")`
          );
        }
      });
    })
    .catch(console.log);
}

setInterval(function () {
  getGames();
}, 300000);
