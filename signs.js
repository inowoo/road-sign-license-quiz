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
