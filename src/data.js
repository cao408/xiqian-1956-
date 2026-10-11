/* 《西迁·1956》内容数据层
 * 全部文案取自 F:/workspace/xiqian_kaoju.md（考据定稿），不得改写历史引语。
 * 只有"选项后果"是本作的设计数值。
 */
const DATA = {

/* ============ 全局设定 ============ */
meta: {
  title: "西迁·1956",
  byline: "微电子2602班团支部",
  addr: "先生",
  startBtn: "开始游戏",
  endingAlways: "如期开学"
},

/* ============ 三资源初始值与上下限 ============ */
res: {
  teachers: { init: 5, min: 3, max: 9, name: "师资名额", unit: "人" },
  load:     { init: 190, min: 165, max: 225, name: "车皮载重", unit: "吨" },
  intact:   { init: 100, min: 60, max: 100, name: "仪器完好率", unit: "%" }
},

/* ============ 第①章：1955—1957 年间的迁校讨论 ============ */
ch1: {
  title: "第①章　争论",
  period: "1955—1957 年间的迁校讨论",
  lead: "党中央关于迁校的决定下来了。校园里一夜之间全是议论，人们看着你——将随校西迁的电机系教授。",
  questions: [
    {
      year: "1955年·迁校决议通过后",
      scene: "校务委员会通过了《关于迁校问题的决议》。消息传开，教研室、宿舍、食堂，到处在说同一件事。",
      asker: "一位老教授",
      quote: "科研中心在北京、上海，西安没有科研机构，许多工厂也要以后才建，为什么现在要搬西安，应该解释清楚。",
      options: [
        { text: "西北是国家的机械电力工业基地，西安需要一所工业大学。交大办在哪里，要跟国家的工业布局走在一起。",
          tag: "讲形势", d: { teachers: +2, load: 0, intact: -5 } },
        { text: "西安给的是新专业、新实验室。那边校园的实验室面积，将来会比上海大三倍。",
          tag: "讲事业", d: { teachers: +1, load: +12, intact: 0 } },
        { text: "搬家、家属工作、孩子上学，这些难处学校一条条去解决，不会让谁一个人扛。",
          tag: "认困难", d: { teachers: 0, load: +8, intact: +5 } }
      ]
    },
    {
      year: "1956年·形势缓和了",
      scene: "国际形势缓和下来，上海也要发展。有人在市人代会上提出：与其交大迁走后再办一所机电学校，不如让交大留下来。",
      asker: "一位青年教师",
      quote: "与其让交通大学迁走以后重新再办一个机电学校，何不就交通大学作留下来的打算。",
      options: [
        { text: "学校的事业在西北。新专业、尖端专业都建在西安，那边正等着人。",
          tag: "只讲西迁", d: { teachers: +2, load: 0, intact: -6 } },
        { text: "两边都需要人。主力西行，能给上海留下多少，就商量着留下多少。",
          tag: "两头都要人", d: { teachers: 0, load: +18, intact: 0 } },
        { text: "该走的走，该留的留，谁先走、什么先装，排成一张表——分批走，一件不丢。",
          tag: "分批无损失", d: { teachers: +1, load: -8, intact: +7 } }
      ]
    },
    {
      year: "1957年·整风鸣放中",
      scene: "讨论越来越烈。校务委员会的扩大会议上，大多数人倾向于不再继续迁校。",
      asker: "一位工会会员",
      quote: "骑虎难下。",
      options: [
        { text: "已经走了两年，几千人已经在西安上课，现在回头，损失更大。坚持修完全程。",
          tag: "坚持西迁", d: { teachers: +2, load: 0, intact: -5 } },
        { text: "这件事不该由少数人定。把问题交给全体师生讨论，讨论出结果，报国务院决定。",
          tag: "交给师生", d: { teachers: +1, load: +12, intact: +3 } },
        { text: "无论怎么定，先把眼下的课和实验守住。西安那边，一台仪器都不能停。",
          tag: "先守教学", d: { teachers: 0, load: +6, intact: +6 } }
      ]
    }
  ],
  card: {
    img: "card1_letter.jpg",
    alt: "1957年9月5日周恩来写给高教部部长杨秀峰的亲笔信",
    quote: "天下兴亡，匹夫有责，支援西北，每个教师都有责任，希望大家克服困难负起责任来！",
    who: "钟兆琳",
    src: "人民日报《弘扬“西迁精神” 到祖国最需要的地方》"
  }
},

/* ============ 第②章：装箱 ============ */
ch2: {
  title: "第②章　装箱",
  period: "1956年·上海",
  lead: "一节车皮。能装下的东西，就是以后西安的全部家底。装不下的，便留在上海。",
  grid: { cols: 7, rows: 5 },
  card: {
    img: "card2_crates.jpg",
    alt: "设备装箱，准备运往西安",
    quote: "既然去西安扎根西北黄土地，就不要再为房子而有所牵挂，这些都是身外之物，不值得去计较。",
    who: "陈学俊",
    src: "人民日报《弘扬“西迁精神” 到祖国最需要的地方》"
  },
  /* 占格(cols×rows 的矩形)、重量、内联 SVG 图标名、价值只用于结算描述 */
  items: [
    { id: "books",   name: "图书与教材",   w: 4, h: 1, wt: 20, icon: "books",   fragile: false, note: "十四万余册图书后来运到西安，占全校藏书七成以上" },
    { id: "inst",    name: "实验仪器",     w: 3, h: 2, wt: 35, icon: "scope",   fragile: true,  note: "全迁或部分西迁的实验室有二十五个，面积比上海时大三倍以上" },
    { id: "meter",   name: "精密测量仪器", w: 3, h: 1, wt: 12, icon: "meter",   fragile: true,  note: "装箱时最怕磕碰，一路要靠人守着" },
    { id: "lathe",   name: "机床",         w: 3, h: 2, wt: 40, icon: "lathe",   fragile: false, shape: [[0,0],[1,0],[2,0],[0,1],[1,1]], note: "机器系的大家伙，装卸一次要十几个人" },
    { id: "charts",  name: "教学挂图与教具", w: 2, h: 1, wt: 6, icon: "charts", fragile: false, note: "上课用的挂图，卷起来占不了多少地方" },
    { id: "archive", name: "历史档案",     w: 3, h: 1, wt: 10, icon: "archive", fragile: false, note: "全部历史档案后来都运抵西安" },
    { id: "desks",   name: "课桌椅",       w: 2, h: 2, wt: 22, icon: "desk",    fragile: false, note: "学生的课桌椅，一车一车地拉" },
    { id: "luggage", name: "师生行李",     w: 3, h: 1, wt: 14, icon: "trunk",   fragile: false, note: "每人一只箱子，就是全部家当" },
    { id: "med",     name: "药品与医疗器械", w: 2, h: 1, wt: 8, icon: "medkit",  fragile: false, note: "医务所先立起来，人才安得下心" },
    { id: "coal",    name: "过冬物资",     w: 3, h: 1, wt: 30, icon: "coal",    fragile: false, note: "西安的冬天，取暖要自己想办法" },
    { id: "cook",    name: "食堂炊具",     w: 2, h: 1, wt: 12, icon: "pot",     fragile: false, note: "几千人要吃饭，灶先得支起来" },
    { id: "type",    name: "打字机与办公用品", w: 2, h: 1, wt: 9, icon: "typewriter", fragile: false, note: "讲义、通知、课表，都靠它" },
    { id: "cards",   name: "图书馆卡片目录", w: 2, h: 1, wt: 7, icon: "cardbox", fragile: false, note: "找书全靠它，丢了等于丢了半个图书馆" },
    { id: "glass",   name: "学生实验器材", w: 2, h: 1, wt: 6, icon: "flask",   fragile: true,  note: "玻璃器皿，装车时得垫上稻草" },
    { id: "motor",   name: "电机实验设备", w: 3, h: 2, wt: 28, icon: "motor",   fragile: true,  shape: [[0,0],[1,0],[0,1],[1,1],[2,1]], note: "后来的电机制造实验室，就是靠这些起家" },
    { id: "organ",   name: "风琴与文体用品", w: 3, h: 2, wt: 18, icon: "organ",   fragile: false, shape: [[1,0],[0,1],[1,1],[2,1]], note: "唱歌、演戏、开学典礼，都用得上" },
    { id: "seal",    name: "校史文献与印章", w: 1, h: 1, wt: 3, icon: "seal",    fragile: false, note: "轻，但是学校的根" },
    { id: "tree",    name: "树苗",         w: 2, h: 1, wt: 10, icon: "sapling", fragile: false, note: "自南方运来，后来长成校园里的梧桐道" }
  ]
},

/* ============ 第③章：西迁路上（只损耗，无死亡） ============ */
ch3: {
  title: "第③章　路上",
  period: "1956年·上海—西安　1509 公里　约 40 小时",
  lead: "专列开动了。硬座，四十个小时。你押着这一列车皮，路上一件件都得有人拿主意。",
  events: [
    {
      scene: "装车那天，天擦黑还没装完。车站催着发车。",
      quote: "「再有两个钟头就开车了。」",
      options: [
        { text: "抢时间，先上车再捆扎。", d: { intact: -8, stamina: 0, delay: 2 }, note: "到站后发现两台仪器松了扣" },
        { text: "宁可晚发两小时，按规矩一件件加固。", d: { intact: +2, stamina: -6, delay: 0 }, note: "发了车，人已经站不住了" },
        { text: "重的在下、轻的在上，分层装载，边装边固定。", d: { intact: -2, stamina: -2, delay: 1 }, note: "稳妥，也慢一点" }
      ]
    },
    {
      scene: "车过中原，下起雨来。篷布上开始积水。",
      quote: "「外面雨不小。」",
      options: [
        { text: "停车把苫布重新捆一遍。", d: { intact: +2, stamina: -5, delay: 2 }, note: "保住了仪器，耽误了行程" },
        { text: "雨不算大，继续赶路。", d: { intact: -9, stamina: 0, delay: 0 }, note: "到了西安，有几箱书受潮" },
        { text: "打开车门通风，人在车厢里守着。", d: { intact: -3, stamina: -8, delay: 1 }, note: "守了一夜" }
      ]
    },
    {
      scene: "编组站。车皮要被重新编挂，钩子一撞，整列车都在响。",
      quote: "「下面要撞了。」",
      options: [
        { text: "下车，把仪器箱再固定一次。", d: { intact: +3, stamina: -6, delay: 2 }, note: "有效果，人也累" },
        { text: "只是编组，不至于出事，不动了。", d: { intact: -10, stamina: 0, delay: 0 }, note: "一台仪器在箱子里滑了位" },
        { text: "留两个人押着这节车厢，其余人休息。", d: { intact: -4, stamina: -3, delay: 1 }, note: "各退一步" }
      ]
    },
    {
      scene: "车上有个孩子发起烧来，家属守着不敢说，被你看见。",
      quote: "「孩子有点热。」",
      options: [
        { text: "让列车在下一站停久些，请站上看看。", d: { intact: 0, stamina: -4, delay: 3 }, note: "孩子退了烧，行程慢了半天" },
        { text: "先去后车厢找随队的校医拿药。", d: { intact: 0, stamina: -6, delay: 1 }, note: "沈校医的药箱里有药" },
        { text: "熬到西安再说，路上没有条件。", d: { intact: 0, stamina: -8, delay: 0 }, note: "一家人一夜没合眼，你也一样" }
      ]
    },
    {
      scene: "到站了。西安下着雨，站台外是一片泥地。车皮要按顺序卸。",
      quote: "「先卸哪一车？」",
      options: [
        { text: "先卸仪器和档案，怕淋。", d: { intact: +3, stamina: -4, delay: 1 }, note: "家底保住了" },
        { text: "先卸行李和过冬物资，人先安顿。", d: { intact: -5, stamina: -2, delay: 0 }, note: "人先暖起来了" },
        { text: "先清点，一件件对完再卸。", d: { intact: -2, stamina: -5, delay: 2 }, note: "账目分毫不差" }
      ]
    }
  ],
  card: {
    img: "card3_ticket.jpg",
    alt: "印有“向科学进军，建设大西北”字样的西迁专列乘车证",
    quote: "今天一定努力学习，明天一定要把祖国建设得更美丽。",
    who: "时任学生会主席 郑善维",
    src: "南方都市报《交通大学西迁往事：向西而歌 一路芳华》"
  }
},

/* ============ 第④章：建设新校 ============ */
ch4: {
  title: "第④章　建校",
  period: "1956年秋·西安　入冬前",
  lead: "马路不平、电灯不明、电话不灵。下雨水泥路，晴天扬灰路。人手就这么多，冬天一天天近了。",
  seconds: 90,
  sites: [
    { id: "dorm",    name: "学生宿舍",     need: 1200, unit: "人",     work: 200, icon: "dorm",    note: "先有住处，人才留得下" },
    { id: "teach",   name: "教学中心大楼", need: 24,   unit: "间教室", work: 120, icon: "teach",   note: "课一天都不能停" },
    { id: "boiler",  name: "锅炉房",       need: 36,   unit: "处暖气", work: 90,  icon: "boiler",  note: "冬天教室只靠一个小炉子取暖" },
    { id: "canteen", name: "食堂",         need: 8,    unit: "口大灶", work: 45,  icon: "canteen", note: "几千人吃饭，灶不能凉" }
  ],
  workers: { perTeacher: 1, base: 1 },
  events: [
    { at: 0.28, scene: "连日下雨，工地停了工。", options: [
      { text: "雨一停就抢，连夜接着干。", d: { stamina: -8, progress: 6 } },
      { text: "先把材料盖好，等天晴。", d: { stamina: -2, progress: -4 } }
    ]},
    { at: 0.58, scene: "有位老师病倒了，医务所只有一个人。", options: [
      { text: "抽一支人手去照看。", d: { stamina: -4, progress: -5 } },
      { text: "让他歇着，工地上的人不动。", d: { stamina: -8, progress: 4 } }
    ]},
    { at: 0.82, scene: "后一批器材到站了，需要人去卸。", options: [
      { text: "抽人去卸货，工地缓一缓。", d: { intact: +6, progress: -6 } },
      { text: "工地不停，让车站再放两天。", d: { intact: -7, progress: 5 } }
    ]}
  ],
  card: {
    img: "card4_campus.jpg",
    alt: "建设当中的西安新校园",
    quote: "没有因为迁校而迟一天开学，没有因为迁校而少开一门课程，也没有因为迁校而耽误原定的教学实验，这被视为奇迹。",
    who: "《交通大学西迁往事》",
    src: "南方都市报《交通大学西迁往事：向西而歌 一路芳华》"
  }
},

/* ============ 第⑤章：1958 年，把实验室办起来 ============ */
ch5: {
  title: "第⑤章　实验室",
  period: "1958年·西安　无线电工程系建立",
  lead: "系里要把新专业办起来：计算机、自动控制、无线电技术。仪器一台台搬进来，可运到不等于能用——接通、校准、亮起来，才算数。",
  card: {
    img: "card5_lab.jpg",
    alt: "师生伏案工作",
    quote: "我们要到西安办校扎根，献身于开发共和国的西部。",
    who: "钟兆琳",
    src: "人民日报《弘扬“西迁精神” 到祖国最需要的地方》"
  },
  instruments: [
    { name: "电子管电压表", dial: 62 },
    { name: "示波器", dial: 78 },
    { name: "信号发生器", dial: 55 },
    { name: "万用表", dial: 40 },
    { name: "稳压电源", dial: 70 },
    { name: "音频振荡器", dial: 66 },
    { name: "电子管测试仪", dial: 84 },
    { name: "高频信号源", dial: 58 }
  ]
},

/* ============ 结算文案（永远向上） ============ */
grades: [
  { min: 0.85, title: "一台不碎",  text: "该来的都来了。课开了，实验做了，仪器一台台亮着——你们把一所大学完整地搬到了西安。" },
  { min: 0.72, title: "如期开学",  text: "课开起来了，实验室也立起来了。没能带走的那几箱，以后慢慢补。" },
  { min: 0.55, title: "课没有停",  text: "东西带得不齐，可课一天也没停。剩下的，是一年一年添起来的。" },
  { min: 0,    title: "先开课",    text: "课开起来了。剩下的，以后再补——这所学校本来就是这么一点点长起来的。" }
],

achievements: [
  { id: "no_miss",   name: "一课不缺",  desc: "四摊子工地都在冬天前动了工" },
  { id: "all_lit",   name: "自主可控",  desc: "仪器全部调通" },
  { id: "book_hoard",name: "满屋的书",  desc: "把图书和卡片目录都带上了车" },
  { id: "no_crack",  name: "一台不碎",  desc: "仪器完好率始终在一半以上" },
  { id: "family",    name: "举家西迁",  desc: "舍掉了住房，带走了家人" },
  { id: "sapling",   name: "梧桐入土",  desc: "把树苗带到了西安" },
  { id: "archive",   name: "一件不失",  desc: "历史档案全部运抵" },
  { id: "students",  name: "人先安顿",  desc: "第③章先卸行李和过冬物资" }
],

/* ============ 片尾 ============ */
epilogue: {
  poem: "长安好，建设待支援，十万健儿湖海气，吴侬软语满街喧，何必忆江南。",
  poet: "沈云扉《忆江南》",
  imgs: ["end_ceremony.jpg", "end_campus59.jpg", "end_library.jpg"],
  credit: "史料照片取自各校校史与党史公开资料，仅用于本次主题团日活动。",
  dev: "开发者：微电子2602曹新张恒",
  thanks: "人物系虚构，设定参考自交通大学西迁时期电类专业教师群体。原型与口述来源：黄席椿、钟兆琳、沈尚贤、陈学俊、沈云扉、史维祥、潘季、胡奈赛、卢烈英、朱继洲、马知恩、张娴如、郑善维、杨延篪、谈文心、贾箭鸣、史瑞琼。",
  sponsor: "微电子2602班团支部"
}
};
