


export class TranslateService {
  public static dictionaries: { [dictName: string]: { [letter: string]: string } } = {
    pseudo: {
      a: "ḁ",
      b: "ḃ",
      c: "ḉ",
      d: "ḓ",
      e: "ḗ",
      f: "ḟ",
      g: "ḡ",
      h: "ḣ",
      i: "ḭ",
      j: "ǰ",
      k: "ḱ",
      l: "ȴ",
      m: "ḿ",
      n: "ṋ",
      o: "ō",
      p: "ṕ",
      q: "ɋ",
      r: "ṙ",
      s: "ṡ",
      t: "ṫ",
      u: "ṳ",
      v: "ṽ",
      w: "ẃ",
      x: "ẍ",
      y: "ẏ",
      z: "ẑ"
    }
  };

  public static getTranslation(messageText: string, langugae: string = "pseudo") {
    const dict = TranslateService.dictionaries[langugae];
    return messageText
      .toLowerCase()
      .split("")
      .map((character) => {
        if (!(character in dict )){
          return character;
        }

        return dict[character];
      }).join("");
  }

}