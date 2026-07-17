(function () {
  "use strict";

  const signs = [
    {
      id: "road-closed",
      number: "301",
      name: "通行止め",
      meaning: "歩行者、遠隔操作型小型車、車、路面電車の通行を禁止する",
      explanation: "車だけでなく、歩行者や路面電車も対象になる全面的な通行止めです。",
      category: "規制標識",
      shape: "circle",
      visual: "road-closed"
    },
    {
      id: "vehicles-closed",
      number: "302",
      name: "車両通行止め",
      meaning: "車の通行を禁止する",
      explanation: "自動車だけでなく、自転車などの軽車両も含む「車」が対象です。",
      category: "規制標識",
      shape: "circle",
      visual: "empty"
    },
    {
      id: "no-entry",
      number: "303",
      name: "車両進入禁止",
      meaning: "一方通行路の出口などから、車が反対方向へ進入することを禁止する",
      explanation: "赤い円に白い横帯。こちら側から車は進入できません。",
      category: "規制標識",
      shape: "circle",
      visual: "no-entry"
    },
    {
      id: "no-cars-except-motorcycles",
      number: "304",
      name: "二輪の自動車以外の自動車通行止め",
      meaning: "二輪の自動車を除く自動車の通行を禁止する",
      explanation: "普通自動車などは通行できませんが、二輪の自動車は対象外です。",
      category: "規制標識",
      shape: "circle",
      visual: "no-car"
    },
    {
      id: "no-large-trucks",
      number: "305",
      name: "大型貨物自動車等通行止め",
      meaning: "大型貨物自動車、特定中型貨物自動車、大型特殊自動車の通行を禁止する",
      explanation: "トラックの図柄で、対象となる大型貨物車などを示します。",
      category: "規制標識",
      shape: "circle",
      visual: "no-truck"
    },
    {
      id: "no-motorcycles",
      number: "307",
      name: "二輪の自動車・一般原動機付自転車通行止め",
      meaning: "二輪の自動車と一般原動機付自転車の通行を禁止する",
      explanation: "大型・普通自動二輪車と一般原動機付自転車が対象です。",
      category: "規制標識",
      shape: "circle",
      visual: "no-motorcycle"
    },
    {
      id: "no-bicycles",
      number: "309",
      name: "特定小型原動機付自転車・自転車通行止め",
      meaning: "特定小型原動機付自転車と自転車の通行を禁止する",
      explanation: "自転車の図柄が描かれ、特定小型原動機付自転車も対象です。",
      category: "規制標識",
      shape: "circle",
      visual: "no-bicycle"
    },
    {
      id: "only-straight",
      number: "311-C",
      name: "指定方向外進行禁止",
      meaning: "矢印の方向以外への車の進行を禁止する",
      explanation: "この図柄では直進だけができます。矢印の組合せには複数の種類があります。",
      category: "規制標識",
      shape: "blue-circle",
      visual: "arrow-up"
    },
    {
      id: "straight-or-left",
      number: "311-A",
      name: "指定方向外進行禁止",
      meaning: "車は直進または左折のみできる",
      explanation: "矢印が示す直進と左折以外には進めません。",
      category: "規制標識",
      shape: "blue-circle",
      visual: "arrow-up-left"
    },
    {
      id: "no-crossing",
      number: "312",
      name: "車両横断禁止",
      meaning: "車が道路を横断することを禁止する",
      explanation: "道路外の施設へ出入りするための左折を伴う横断は除かれます。",
      category: "規制標識",
      shape: "circle",
      visual: "no-crossing"
    },
    {
      id: "no-uturn",
      number: "313",
      name: "転回禁止",
      meaning: "車の転回を禁止する",
      explanation: "Uターンは禁止です。右折禁止とは意味が異なります。",
      category: "規制標識",
      shape: "circle",
      visual: "no-uturn"
    },
    {
      id: "no-overtaking-over-line",
      number: "314",
      name: "追越しのための右側部分はみ出し通行禁止",
      meaning: "追越しのために道路の右側部分へはみ出して通行することを禁止する",
      explanation: "追越し自体を一律に禁止する標識ではなく、右側へのはみ出しを禁止します。",
      category: "規制標識",
      shape: "circle",
      visual: "no-overtake"
    },
    {
      id: "no-overtaking",
      number: "314の2",
      name: "追越し禁止",
      meaning: "車の追越しを禁止する",
      explanation: "補助標識と組み合わせて、追越しそのものを禁止します。",
      category: "規制標識",
      shape: "circle",
      visual: "no-overtake-double"
    },
    {
      id: "no-parking-stopping",
      number: "315",
      name: "駐停車禁止",
      meaning: "車の駐車と停車を禁止する",
      explanation: "赤い二本線の交差が目印。駐車だけでなく停車も禁止です。",
      category: "規制標識",
      shape: "blue-circle",
      visual: "no-stopping"
    },
    {
      id: "no-parking",
      number: "316",
      name: "駐車禁止",
      meaning: "車の駐車を禁止する",
      explanation: "赤い斜線が一本。法令上の「停車」まで一律に禁止する標識ではありません。",
      category: "規制標識",
      shape: "blue-circle",
      visual: "no-parking"
    },
    {
      id: "weight-limit",
      number: "320",
      name: "重量制限",
      meaning: "総重量が表示された重量を超える車の通行を禁止する",
      explanation: "車両と積載物を合わせた総重量で判断します。",
      category: "規制標識",
      shape: "circle",
      visual: "weight"
    },
    {
      id: "height-limit",
      number: "321",
      name: "高さ制限",
      meaning: "積載物を含む高さが表示値を超える車の通行を禁止する",
      explanation: "車両だけでなく、積んだ荷物の高さも含めて判断します。",
      category: "規制標識",
      shape: "circle",
      visual: "height"
    },
    {
      id: "width-limit",
      number: "322",
      name: "最大幅",
      meaning: "積載物を含む幅が表示値を超える車の通行を禁止する",
      explanation: "車両と積載物を含む横幅が対象です。",
      category: "規制標識",
      shape: "circle",
      visual: "width"
    },
    {
      id: "maximum-speed",
      number: "323",
      name: "最高速度",
      meaning: "自動車と路面電車などの最高速度を指定する",
      explanation: "表示された速度を超えて運転してはいけません。図では時速50kmです。",
      category: "規制標識",
      shape: "circle",
      visual: "max-speed"
    },
    {
      id: "minimum-speed",
      number: "324",
      name: "最低速度",
      meaning: "自動車の最低速度を指定する",
      explanation: "青地の数字と下線が目印です。やむを得ない場合を除き、表示速度以上で通行します。",
      category: "規制標識",
      shape: "circle",
      visual: "min-speed"
    },
    {
      id: "motor-vehicles-only",
      number: "325",
      name: "自動車専用",
      meaning: "高速自動車国道または自動車専用道路であることを指定する",
      explanation: "歩行者、自転車、一般原動機付自転車などは通行できません。",
      category: "規制標識",
      shape: "blue-circle",
      visual: "car-only"
    },
    {
      id: "bicycles-only",
      number: "325の2",
      name: "特定小型原動機付自転車・自転車専用",
      meaning: "自転車道や自転車専用道路を指定し、対象外の車や歩行者などの通行を禁止する",
      explanation: "特定小型原動機付自転車と自転車のための道路・通行部分を示します。",
      category: "規制標識",
      shape: "blue-circle",
      visual: "bicycle-only"
    },
    {
      id: "bicycles-pedestrians-only",
      number: "325の3",
      name: "普通自転車等及び歩行者等専用",
      meaning: "普通自転車等と歩行者等の専用道路または通行できる歩道を指定する",
      explanation: "自転車と歩行者の図柄が一緒に描かれています。",
      category: "規制標識",
      shape: "blue-circle",
      visual: "bicycle-pedestrian-only"
    },
    {
      id: "pedestrians-only",
      number: "325の4",
      name: "歩行者等専用",
      meaning: "歩行者専用道路または歩行者用道路を指定する",
      explanation: "歩行者と遠隔操作型小型車のための道路を示します。",
      category: "規制標識",
      shape: "blue-circle",
      visual: "pedestrian-only"
    },
    {
      id: "one-way",
      number: "326-A",
      name: "一方通行",
      meaning: "矢印と反対方向への車の通行を禁止する",
      explanation: "車は矢印が示す方向にだけ通行できます。",
      category: "規制標識",
      shape: "square horizontal",
      visual: "one-way"
    },
    {
      id: "bicycle-one-way",
      number: "326の2-A",
      name: "特定小型原動機付自転車・自転車一方通行",
      meaning: "特定小型原動機付自転車と自転車の矢印と反対方向への進行を禁止する",
      explanation: "自転車などに限って一方通行を指定します。",
      category: "規制標識",
      shape: "square horizontal",
      visual: "bicycle-one-way"
    },
    {
      id: "reserved-lane",
      number: "327の4",
      name: "専用通行帯",
      meaning: "表示された車の専用通行帯を指定する",
      explanation: "標示板に示された車両が専用で通行する車線です。",
      category: "規制標識",
      shape: "square horizontal",
      visual: "reserved-lane"
    },
    {
      id: "bicycle-lane",
      number: "327の4の2",
      name: "普通自転車専用通行帯",
      meaning: "普通自転車の専用通行帯を指定する",
      explanation: "車道上に設けられた普通自転車専用の通行帯です。",
      category: "規制標識",
      shape: "square horizontal",
      visual: "bicycle-lane"
    },
    {
      id: "bus-priority-lane",
      number: "327の5",
      name: "路線バス等優先通行帯",
      meaning: "路線バスなどの優先通行帯を指定する",
      explanation: "一般車も条件付きで通行できますが、路線バスなどの通行を妨げてはいけません。",
      category: "規制標識",
      shape: "square horizontal",
      visual: "bus-priority"
    },
    {
      id: "direction-by-lane",
      number: "327の7-A",
      name: "進行方向別通行区分",
      meaning: "交差点で進行する方向ごとに車の通行区分を指定する",
      explanation: "各車線の矢印に従い、交差点へ進入します。",
      category: "規制標識",
      shape: "square horizontal",
      visual: "lane-directions"
    },
    {
      id: "roundabout",
      number: "327の10",
      name: "環状の交差点における右回り通行",
      meaning: "環状交差点で車が右回りに通行することを指定する",
      explanation: "日本の環状交差点では、中央の島に沿って右回りに進みます。",
      category: "規制標識",
      shape: "blue-circle",
      visual: "roundabout"
    },
    {
      id: "slow",
      number: "329-A",
      name: "徐行",
      meaning: "車と路面電車に徐行を指定する",
      explanation: "すぐに停止できるような速度で進行します。",
      category: "規制標識",
      shape: "slow",
      visual: "slow"
    },
    {
      id: "priority-road-ahead",
      number: "329の2-A",
      name: "前方優先道路",
      meaning: "前方で交差する道路が優先道路であることを指定する",
      explanation: "前方の交差道路を通行する車などの進行を妨げないよう注意します。",
      category: "規制標識",
      shape: "slow",
      visual: "priority-ahead"
    },
    {
      id: "stop",
      number: "330-A",
      name: "一時停止",
      meaning: "交通整理のない交差点の直前で、車や路面電車に一時停止を指定する",
      explanation: "停止線の直前、停止線がないときは交差点の直前で必ず止まります。",
      category: "規制標識",
      shape: "stop",
      visual: "stop"
    },
    {
      id: "no-pedestrians",
      number: "331",
      name: "歩行者等通行止め",
      meaning: "歩行者と遠隔操作型小型車の通行を禁止する",
      explanation: "歩行者の図柄に赤い斜線が入った規制標識です。",
      category: "規制標識",
      shape: "circle",
      visual: "no-pedestrian"
    },
    {
      id: "no-pedestrian-crossing",
      number: "332",
      name: "歩行者等横断禁止",
      meaning: "歩行者と遠隔操作型小型車の横断を禁止する",
      explanation: "道路の横断を禁止する標識で、通行止めとは規制の範囲が異なります。",
      category: "規制標識",
      shape: "circle",
      visual: "no-pedestrian-crossing"
    },
    {
      id: "parking-allowed",
      number: "403",
      name: "駐車可",
      meaning: "車が駐車できることを示す",
      explanation: "青い四角に白いPが目印です。補助標識で条件が示されることがあります。",
      category: "指示標識",
      shape: "blue-circle",
      visual: "parking"
    },
    {
      id: "priority-road",
      number: "405",
      name: "優先道路",
      meaning: "その道路が優先道路であることを示す",
      explanation: "太い縦線が、交差する道路に対して優先する道路を表します。",
      category: "指示標識",
      shape: "square",
      visual: "priority-road"
    },
    {
      id: "pedestrian-crossing",
      number: "407-A",
      name: "横断歩道",
      meaning: "横断歩道であることを示す",
      explanation: "横断する歩行者がいるときは、横断歩道の手前で一時停止します。",
      category: "指示標識",
      shape: "square",
      visual: "crosswalk"
    },
    {
      id: "bicycle-crossing",
      number: "407の2",
      name: "自転車横断帯",
      meaning: "自転車横断帯であることを示す",
      explanation: "自転車が道路を横断するための場所を示します。",
      category: "指示標識",
      shape: "square",
      visual: "bicycle-crossing"
    }
  ];

  const learningDetails = {
    "road-closed": {
      hint: "赤い円の中の斜めの帯と『通行止』の文字に注目してください。",
      detail: "歩行者、遠隔操作型小型車、車、路面電車まで対象になる全面的な通行止めです。補助標識が付く場合は、区間、時間、除外対象も合わせて確認します。",
      confusion: "『車両通行止め』は車だけが対象です。この標識は歩行者なども対象になる点が違います。"
    },
    "vehicles-closed": {
      hint: "赤い円の内側が白く、乗り物の絵がない標識です。",
      detail: "ここでいう『車』には、自動車や二輪車だけでなく、自転車などの軽車両も含まれます。歩行者の通行まで禁止する標識ではありません。",
      confusion: "『通行止め』は歩行者や路面電車も対象ですが、『車両通行止め』は車が対象です。"
    },
    "no-entry": {
      hint: "赤い円の中央に、進入をふさぐような白い横帯があります。",
      detail: "標識が向いている側から車が入ることを禁止します。一方通行路の出口などに設けられ、反対方向からの通行まで禁止するものではありません。",
      confusion: "『車両通行止め』は道路の通行そのものを規制しますが、こちらは特定方向からの進入を規制します。"
    },
    "no-cars-except-motorcycles": {
      hint: "赤い斜線の下に、正面から見た乗用車が描かれています。",
      detail: "普通自動車など、二輪の自動車以外の自動車が対象です。二輪の自動車や自転車まで一律に禁止する標識ではありません。",
      confusion: "車の種類を限定しない『車両通行止め』よりも、規制対象が狭い標識です。"
    },
    "no-large-trucks": {
      hint: "赤い斜線の下に、大きな貨物車の図があります。",
      detail: "大型貨物自動車、特定中型貨物自動車、大型特殊自動車が主な対象です。補助標識で最大積載量などが示されている場合は、その条件も確認します。",
      confusion: "『重量制限』は車種ではなく総重量の数値で判断します。"
    },
    "no-motorcycles": {
      hint: "斜線の下に、エンジン付き二輪車の運転者が描かれています。",
      detail: "二輪の自動車と一般原動機付自転車の通行を禁止します。自転車を示す標識ではありません。",
      confusion: "自転車の絵だけがある『特定小型原動機付自転車・自転車通行止め』と区別します。"
    },
    "no-bicycles": {
      hint: "赤い斜線の下に、ペダルのある自転車が描かれています。",
      detail: "特定小型原動機付自転車と自転車の通行を禁止します。一般原動機付自転車や自動二輪車を示す図柄ではありません。",
      confusion: "運転者が描かれた二輪車通行止めは、エンジン付き二輪車が対象です。"
    },
    "only-straight": {
      hint: "青い円の中に、上向きの矢印が1本だけあります。",
      detail: "矢印が示す直進方向以外へ進むことを禁止します。交差点では右折・左折せず、そのまま直進します。",
      confusion: "矢印が2本以上ある指定方向外進行禁止は、示された複数方向から選べます。"
    },
    "straight-or-left": {
      hint: "青い円の中で、矢印が上と左の2方向に分かれています。",
      detail: "直進または左折だけができます。右折はできません。矢印の組み合わせごとに許される進行方向が変わります。",
      confusion: "上向き矢印1本の標識は直進のみです。"
    },
    "no-crossing": {
      hint: "道路を横切る動きを表す矢印に、赤い斜線が重なっています。",
      detail: "道路の反対側にある施設へ入るなど、車が道路を横断する行為を禁止します。道路外施設へ左折して入る場合など、法令上の除外があります。",
      confusion: "『転回禁止』はUターンだけを禁止します。横断禁止とは規制する動きが異なります。"
    },
    "no-uturn": {
      hint: "折り返すU字形の矢印に赤い斜線があります。",
      detail: "車が進行方向を反対に変える転回、いわゆるUターンを禁止します。右折や道路横断をすべて禁止する標識ではありません。",
      confusion: "『車両横断禁止』は道路を横切る動きが対象で、Uターン禁止とは別の規制です。"
    },
    "no-overtaking-over-line": {
      hint: "2本の矢印のうち、右側へはみ出す動きに赤い斜線があります。",
      detail: "追越しのために道路の右側部分へはみ出すことを禁止します。右側部分へはみ出さずに行える追越しまで一律に禁止する意味ではありません。",
      confusion: "下に『追越し禁止』の補助標識が付く場合は、追越しそのものが禁止されます。"
    },
    "no-overtaking": {
      hint: "円形標識の下に『追越し禁止』と書かれた補助標識があります。",
      detail: "補助標識との組み合わせにより、右側部分へはみ出すかどうかにかかわらず、車の追越しを禁止します。",
      confusion: "補助標識がない『追越しのための右側部分はみ出し通行禁止』は、追越し自体を全面禁止するものではありません。"
    },
    "no-parking-stopping": {
      hint: "青地に赤い斜線が2本あり、赤いXの形になっています。",
      detail: "駐車だけでなく停車も禁止です。図の『8-20』は8時から20時まで規制される例を示し、時間表示がなければ原則として終日対象です。曜日・車種などの補助標識があれば、その条件も適用されます。",
      confusion: "赤い斜線が1本の『駐車禁止』は、駐車を禁止しますが停車まで一律に禁止しません。"
    },
    "no-parking": {
      hint: "青地に赤い斜線が1本だけ入っています。",
      detail: "図の『8-20』は8時から20時まで駐車禁止となる例です。人の乗り降りや、運転者がすぐ運転できる状態で行う5分以内の荷物の積卸しは、法令上の駐車から除かれます。ただし、運転者が車を離れてすぐに運転できない状態なら、時間の長短にかかわらず駐車です。",
      confusion: "斜線が2本の『駐停車禁止』は、短い停車も禁止します。"
    },
    "weight-limit": {
      hint: "円の中に『5.5t』という重さの単位があります。",
      detail: "図では、車両・乗員・積載物を合わせた総重量が5.5トンを超える車は通行できません。荷物だけの重さや最大積載量ではなく、総重量で判断します。",
      confusion: "大型貨物自動車等通行止めは車種で判断し、重量制限は表示された数値で判断します。"
    },
    "height-limit": {
      hint: "『3.3m』と上下方向を示す三角形があります。",
      detail: "図では、積載物を含む高さが3.3メートルを超える車は通行できません。ルーフ上の荷物なども高さに含めます。",
      confusion: "『最大幅』は左右方向の寸法、『重量制限』は総重量を規制します。"
    },
    "width-limit": {
      hint: "『2.2m』と左右方向を示す三角形があります。",
      detail: "図では、積載物を含む幅が2.2メートルを超える車は通行できません。車体から左右にはみ出した荷物も含めて判断します。",
      confusion: "上下方向の三角形と『3.3m』がある標識は高さ制限です。"
    },
    "maximum-speed": {
      hint: "赤い円の中に速度の数字があり、数字の下線はありません。",
      detail: "図では最高速度は時速50キロメートルです。天候や道路状況により、表示速度よりさらに安全な速度へ落とす必要があります。",
      confusion: "数字の下に青い線がある『最低速度』と見分けます。"
    },
    "minimum-speed": {
      hint: "数字の下に青い横線が引かれています。",
      detail: "図では最低速度は時速30キロメートルです。危険防止などやむを得ない場合を除き、表示速度に達しない速度で通行してはいけません。",
      confusion: "下線のない数字は最高速度です。数字そのものだけで判断しないようにします。"
    },
    "motor-vehicles-only": {
      hint: "青い円の中に、自動車を正面から見た白い図があります。",
      detail: "高速自動車国道または自動車専用道路であることを示します。歩行者、自転車、一般原動機付自転車などは通行できません。",
      confusion: "赤い斜線と自動車の図がある標識は、自動車の通行を禁止する側の標識です。"
    },
    "bicycles-only": {
      hint: "青い円の中に、自転車だけが白く描かれています。",
      detail: "特定小型原動機付自転車と自転車の専用道路・通行部分を指定します。歩行者も通れることを示す標識ではありません。",
      confusion: "歩行者の図も一緒にある場合は『普通自転車等及び歩行者等専用』です。"
    },
    "bicycles-pedestrians-only": {
      hint: "青い円の中に、歩行者と自転車の両方が描かれています。",
      detail: "普通自転車等と歩行者等が通行する専用道路、または普通自転車等が通行できる歩道を指定します。自転車は歩行者の安全を優先して通行します。",
      confusion: "自転車だけ、または歩行者だけの青い円形標識と、図柄の人数・車種で見分けます。"
    },
    "pedestrians-only": {
      hint: "青い円の中に、大人と子どもの歩行者が描かれています。",
      detail: "歩行者等のための道路を指定します。自転車から降りて押して歩く人は、道路交通法上は歩行者として扱われます。",
      confusion: "自転車の図もある共有標識とは異なり、自転車に乗ったまま通れることを示しません。"
    },
    "one-way": {
      hint: "青い横長の四角に、太い白矢印が1本あります。",
      detail: "車は矢印が示す方向にのみ通行できます。道路の一定区間に対する進行方向の規制です。",
      confusion: "青い円形の『指定方向外進行禁止』は、主に交差点で進める方向を指定します。"
    },
    "bicycle-one-way": {
      hint: "横長の矢印の中に、自転車の図が組み合わされています。",
      detail: "特定小型原動機付自転車と自転車に限って、矢印方向への一方通行を指定します。他の車までこの標識だけで一方通行になるわけではありません。",
      confusion: "自転車の図がない『一方通行』は車全般が対象です。"
    },
    "reserved-lane": {
      hint: "車線の図の中にバスと『専用』の文字があります。",
      detail: "表示された種類の車が専用で通行する車両通行帯です。他の車は、右左折など法令上認められる場合を除き、その通行帯を通行しません。",
      confusion: "『優先』と書かれた路線バス等優先通行帯では、一般車の通行が常に禁止されるわけではありません。"
    },
    "bicycle-lane": {
      hint: "車線の図に、自転車と『専用』の文字があります。",
      detail: "普通自転車専用通行帯を指定します。自動車などは、右左折等の必要な場合を除き通行しません。",
      confusion: "青い円形の自転車専用は道路・通行部分、四角い車線図は車道上の専用通行帯を示します。"
    },
    "bus-priority-lane": {
      hint: "バスの図の下に『優先』と書かれています。",
      detail: "一般車も通行できますが、路線バスなどが近づいたときにその通行を妨げないよう、速やかに通行帯から出られる状態で走行します。",
      confusion: "『専用』は原則として対象車だけ、『優先』は一般車も条件付きで通行できる点が違います。"
    },
    "direction-by-lane": {
      hint: "複数の車線ごとに、別々の白い矢印が描かれています。",
      detail: "交差点で進む方向ごとに使用する車線を指定します。進みたい方向の矢印がある車線へ、手前から安全に進路変更しておきます。",
      confusion: "円形の指定方向外進行禁止は進行方向を、こちらは方向ごとの通行区分を指定します。"
    },
    "roundabout": {
      hint: "青い円の中で、3本の矢印が輪になっています。",
      detail: "環状交差点では中央の島に沿って右回りに通行します。進入時は徐行し、すでに環状部分を通行している車の進行を妨げません。",
      confusion: "単なる転回の矢印ではなく、複数の矢印が円を作っているのが目印です。"
    },
    "slow": {
      hint: "逆三角形の中に『徐行 SLOW』と書かれています。",
      detail: "徐行とは、車がすぐに停止できるような速度で進むことです。時速何キロという一律の数字で決まるものではありません。",
      confusion: "『前方優先道路』は同じ徐行標識の下に、その文字の補助標識が付きます。"
    },
    "priority-road-ahead": {
      hint: "逆三角形の下に『前方優先道路』という補助標識があります。",
      detail: "前方で交差する道路が優先道路です。交差道路を通行する車や路面電車の進行を妨げないよう、徐行して安全を確認します。",
      confusion: "逆三角形だけの『徐行』に、前方優先道路の補助標識が付いた組み合わせです。"
    },
    "stop": {
      hint: "赤い逆三角形に『止まれ STOP』と書かれています。",
      detail: "停止線の直前で完全に停止します。停止線がない場合は交差点の直前で止まり、交差道路の車や路面電車の進行を妨げません。",
      confusion: "『徐行』はすぐ止まれる速度で進む規制ですが、『一時停止』は必ず完全に止まります。"
    },
    "no-pedestrians": {
      hint: "赤い四角の中で、歩行者の進行方向に斜線があります。",
      detail: "歩行者と遠隔操作型小型車が、その道路や区間を通行することを禁止します。",
      confusion: "『歩行者等横断禁止』は道路を横切る行為が対象で、道路に沿った通行禁止とは異なります。"
    },
    "no-pedestrian-crossing": {
      hint: "歩行者の左右に道路線があり、『横断禁止』と書かれています。",
      detail: "歩行者と遠隔操作型小型車が道路を横断することを禁止します。近くの横断歩道や歩道橋などを利用します。",
      confusion: "『歩行者等通行止め』は道路に沿って通ることも含む通行規制です。"
    },
    "parking-allowed": {
      hint: "青い四角の中央に、大きな白いPがあります。",
      detail: "車が駐車できる場所を示します。ただし、補助標識に時間、車種、駐車方法などが示されている場合はその条件に従い、他の交通を妨げる駐車はできません。",
      confusion: "青地に赤い斜線がある円形標識は、駐車を禁止する側の標識です。"
    },
    "priority-road": {
      hint: "白い太い縦線に、細い横線が交差しています。",
      detail: "自分が通行している道路が優先道路であることを示します。優先道路でも安全確認義務はなくならず、信号や他の規制があればそれに従います。",
      confusion: "『前方優先道路』は、自分の前を横切る交差道路の側が優先であることを示します。"
    },
    "pedestrian-crossing": {
      hint: "青い三角形の中に、歩いて横断する人が描かれています。",
      detail: "横断歩道の手前では、歩行者がいないことが明らかな場合を除いて停止できる速度で進みます。横断中または横断しようとする歩行者がいるときは、手前で一時停止して道を譲ります。",
      confusion: "自転車の図がある三角形は自転車横断帯です。"
    },
    "bicycle-crossing": {
      hint: "青い三角形の中に、横向きの自転車が描かれています。",
      detail: "自転車横断帯であることを示します。横断しようとする自転車の有無を確認し、その通行を妨げないようにします。",
      confusion: "歩行者の図があるものは横断歩道です。図柄が自転車か人かを確認します。"
    }
  };

  signs.forEach((sign) => Object.assign(sign, learningDetails[sign.id]));

  function escapeAttribute(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function createSignMarkup(sign, size, concealLabel) {
    const sizeClass = size === "small" ? " is-small" : size === "medium" ? " is-medium" : "";
    const accessibility = concealLabel ? ' alt="" aria-hidden="true"' : ' alt="' + escapeAttribute(sign.name) + '"';
    const loading = size === "medium" ? "lazy" : "eager";
    const priority = size === "large" ? ' fetchpriority="high"' : "";
    return '<img class="road-sign' + sizeClass + '" src="assets/signs/' +
      encodeURIComponent(sign.id) + '.png"' + accessibility +
      ' width="512" height="512" loading="' + loading + '" decoding="async"' + priority + ">";
  }

  window.SIGN_DATA = signs;
  window.createSignMarkup = createSignMarkup;
})();
