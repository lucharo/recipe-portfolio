"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cooklang_ts_1 = require("@cooklang/cooklang-ts");
// const { Recipe, Parser } = require('@cooklang/cooklang-ts');
var source = "\n>> name: Stuffed Tomatoes with Rice\n>> servings: 4\n\nPreheat the #oven{} to ~{180\u00B0C}.\n\nCut the tops off of @tomatoes{4 large} and scoop out the insides to create a 'shell'. Keep the insides.\n\nIn a #pan{}, saut\u00E9 @onions{1 chopped} and @garlic{2 cloves minced} in @olive oil{2 tbsp} until translucent.\n\nAdd the insides of the tomatoes (chopped) to the pan and cook for ~{5 minutes}.\n\nAdd @uncooked rice{1 cup} to the pan, along with @water{2 cups}, @salt{}, and @pepper{}. Allow the mixture to simmer until the rice is cooked, approximately ~{18 minutes}.\n\nIn the meantime, place the tomato 'shells' in a #baking dish{} and drizzle with a bit of olive oil, then bake for ~{10 minutes}.\n\nOnce the rice is cooked, add chopped @fresh basil{2 tbsp} and @grated Parmesan cheese{1/4 cup} to the pan and stir to combine.\n\nFill the pre-baked tomato shells with the rice mixture.\n\nReturn the stuffed tomatoes to the oven and bake for an additional ~{15 minutes}.\n\nGarnish with more fresh basil and serve hot.\n\n";
console.log(new cooklang_ts_1.Parser(includeStepNumber = true)
    .parse(source)
    .ingredients);
// {
//     source: 'https://www.dinneratthezoo.com/wprm_print/6796',
//     'total time': '6 minutes',
//     servings: '2',
// }
