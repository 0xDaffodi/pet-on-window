import pikachu from "./25_pikachu.gif"
import poliwrath from "./62_poliwrath.gif"
import jolteon from "./135_jolteon.gif"
import drifloon from "./425_drifloon.gif"
import goomy from "./704_goomy.gif"

type pokemon = {
  src: string;
  index: number;
  name_zh: string;
  name_en: string;
  name_ja: string;
}

export const pokemons: pokemon[] = [
  {
    src: pikachu,
    index: 25,
    name_zh: "皮卡丘",
    name_en: "Pikachu",
    name_ja: "ピカチュウ"
  },
  {
    src: poliwrath,
    index: 62,
    name_zh: "蚊香泳士",
    name_en: "Poliwrath",
    name_ja: "ニョロボン"
  },
  {
    src: jolteon,
    index: 135,
    name_zh: "雷伊布",
    name_en: "Jolteon",
    name_ja: "サンダース"
  },
  {
    src: drifloon,
    index: 425,
    name_zh: "飘飘球",
    name_en: "Drifloon",
    name_ja: "フワンテ"
  },
  {
    src: goomy,
    index: 704,
    name_zh: "黏黏宝",
    name_en: "Goomy",
    name_ja: "ヌメラ"
  }
]