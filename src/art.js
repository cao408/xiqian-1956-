/* 《西迁·1956》图形层：全部手写 SVG，1950 年代图鉴线描风。
 * 统一 viewBox 0 0 100 100，stroke=currentColor，线宽 3，圆头圆角，不填色。
 * 用法：ART.icon('books') → 直接插入 <svg viewBox="0 0 100 100">…</svg> 内部。
 */
const ART = (() => {
  const wrap = (inner) => `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor"
    stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

  const I = {
    /* —— 第②章 十八件物品 —— */
    books: `<rect x="16" y="66" width="68" height="12" rx="2"/><path d="M22 66v12M78 66v12"/>
            <rect x="22" y="52" width="56" height="12" rx="2"/><path d="M28 52v12M72 52v12"/>
            <path d="M28 52l6-14h32l6 14"/><path d="M50 38v14"/>`,

    scope: `<rect x="12" y="28" width="76" height="46" rx="4"/><circle cx="38" cy="51" r="14"/>
            <path d="M28 51q5-9 10 0t10 0"/><circle cx="66" cy="42" r="4"/><circle cx="66" cy="60" r="4"/>
            <path d="M30 74v10h40V74"/>`,

    meter: `<rect x="14" y="20" width="72" height="58" rx="6"/><circle cx="50" cy="49" r="21"/>
            <path d="M50 49l11-10"/><path d="M34 36l-3-4M66 36l3-4"/><path d="M26 66l-6 10M74 66l6 10"/>`,

    lathe: `<path d="M10 60h80"/><rect x="18" y="42" width="26" height="18" rx="3"/>
            <circle cx="46" cy="51" r="9"/><path d="M58 51h14"/><rect x="72" y="40" width="16" height="20" rx="3"/>
            <path d="M22 60v16M82 60v16"/><path d="M18 76h70"/>`,

    charts: `<path d="M18 16v66"/><path d="M18 22c16-8 48-8 64 0"/><circle cx="82" cy="22" r="4"/>
             <rect x="26" y="34" width="48" height="34" rx="2"/><path d="M32 44h36M32 52h36M32 60h22"/>`,

    archive: `<path d="M22 34h56v42H22z"/><path d="M16 24h68v10H16z"/><path d="M22 50h56"/>
              <path d="M40 20h20"/><path d="M30 62h18M30 70h10"/>`,

    desk: `<rect x="14" y="40" width="52" height="7" rx="2"/><path d="M20 47v30M60 47v30"/>
           <rect x="68" y="54" width="18" height="6" rx="2"/><path d="M72 60v17M82 60v17"/>
           <path d="M74 40h10v14"/><path d="M14 78h72"/>`,

    trunk: `<rect x="18" y="36" width="64" height="42" rx="5"/><path d="M18 52h64"/>
            <path d="M40 36v-6a10 10 0 0120 0v6"/><rect x="45" y="46" width="10" height="12" rx="2"/>
            <path d="M26 44v26M74 44v26"/>`,

    medkit: `<rect x="14" y="34" width="72" height="46" rx="4"/><path d="M14 50h72"/>
             <path d="M38 34v-6h24v6"/><path d="M50 58v14M43 65h14"/>`,

    coal: `<rect x="24" y="20" width="52" height="14" rx="7"/><path d="M38 20v14M54 20v14"/>
           <circle cx="32" cy="64" r="9"/><circle cx="50" cy="70" r="9"/><circle cx="68" cy="62" r="9"/>
           <circle cx="42" cy="50" r="8"/><path d="M18 84h64"/>`,

    pot: `<path d="M14 44h72"/><path d="M22 44v16a16 16 0 0016 16h24a16 16 0 0016-16V44"/>
          <path d="M34 34c0-7 7-7 7-13M50 32c0-7 7-7 7-13M66 34c0-7 7-7 7-13"/><path d="M86 44l8-6"/>`,

    typewriter: `<rect x="18" y="46" width="64" height="28" rx="4"/><path d="M28 46l8-16h28l8 16"/>
                 <path d="M40 40h20"/><path d="M28 60h44"/><path d="M26 78h48"/>`,

    cardbox: `<rect x="20" y="22" width="60" height="58" rx="3"/><path d="M20 41h60M20 60h60"/>
              <path d="M30 32h40M30 51h40M30 70h40"/><rect x="44" y="12" width="12" height="10" rx="2"/>`,

    flask: `<path d="M42 18h16v20l14 28a9 9 0 01-8 14H36a9 9 0 01-8-14l14-28z"/>
            <path d="M36 18h28"/><path d="M32 60h36"/><path d="M14 34v20a7 7 0 0014 0V34"/>`,

    motor: `<rect x="24" y="32" width="52" height="36" rx="6"/><circle cx="50" cy="50" r="11"/>
            <path d="M50 26v-8"/><path d="M30 68v12h40V68"/><path d="M12 50h-6M94 50h-6"/>`,

    organ: `<rect x="18" y="44" width="64" height="28" rx="3"/><path d="M26 44v-10h48v10"/>
            <path d="M30 54v18M40 54v18M50 54v18M60 54v18M70 54v18"/>
            <path d="M18 72h64"/><path d="M32 84h40"/>`,

    seal: `<rect x="16" y="46" width="36" height="42" rx="2"/><path d="M22 58h24M22 68h24M22 78h14"/>
           <path d="M64 24h20v12a6 6 0 01-6 6h-8a6 6 0 01-6-6z"/><path d="M70 42v8h8v-8"/>
           <path d="M62 58h26"/><circle cx="75" cy="66" r="5"/>`,

    sapling: `<path d="M50 80V42"/><path d="M50 58c-11 0-17-7-19-16 13-2 19 5 19 16"/>
              <path d="M50 50c9-2 15-9 15-18-11-2-15 7-15 18"/>
              <path d="M34 80h32"/><path d="M38 88h24"/>`,

    /* —— 第④章 四个工地 —— */
    dorm: `<path d="M18 40l32-16 32 16"/><rect x="22" y="40" width="56" height="42"/>
           <rect x="32" y="50" width="12" height="12"/><rect x="56" y="50" width="12" height="12"/>
           <path d="M44 82V68h12v14"/>`,

    teach: `<path d="M12 34h76v6H12z"/><path d="M20 40v38M34 40v38M50 40v38M66 40v38M80 40v38"/>
            <path d="M12 78h76"/><path d="M12 86h76"/><path d="M50 34V20"/><path d="M50 20h16v8"/>`,

    boiler: `<rect x="34" y="36" width="34" height="44" rx="10"/><path d="M68 36V18h10v18"/>
             <path d="M34 52h34"/><circle cx="51" cy="64" r="7"/><path d="M20 44h14M20 60h14"/>
             <path d="M28 80h44"/>`,

    canteen: `<path d="M18 42l32-16 32 16"/><rect x="22" y="42" width="56" height="38"/>
              <circle cx="50" cy="60" r="10"/><path d="M42 60h16"/>
              <path d="M36 32c0-6 6-6 6-11M58 32c0-6 6-6 6-11"/>`,

    /* —— 其它 —— */
    wagon: `<rect x="6" y="28" width="88" height="46" rx="4"/><path d="M6 42h88M6 56h88"/>
            <path d="M28 28v46M72 28v46"/><circle cx="26" cy="82" r="7"/><circle cx="74" cy="82" r="7"/>`,

    train: `<rect x="28" y="34" width="58" height="34" rx="4"/><path d="M28 48h58"/>
            <path d="M28 34V22h18v12"/><path d="M18 68h76"/><circle cx="42" cy="76" r="7"/>
            <circle cx="74" cy="76" r="7"/><path d="M20 40h6M20 52h6"/>`,

    instrument: `<rect x="14" y="24" width="72" height="52" rx="5"/><circle cx="44" cy="50" r="17"/>
                 <path d="M44 50l10-9"/><circle cx="74" cy="38" r="4"/><circle cx="74" cy="56" r="4"/>
                 <path d="M30 76v10h40V76"/>`,

    arrow: `<path d="M20 50h52"/><path d="M60 38l14 12-14 12"/>`,
    check: `<path d="M22 52l18 18 38-40"/>`,
    star: `<path d="M50 16l10 22 24 3-18 16 5 24-21-12-21 12 5-24L16 41l24-3z"/>`,
    bolt: `<path d="M56 12L28 56h18l-6 32 32-46H54z"/>`,
    card: `<rect x="14" y="22" width="72" height="56" rx="4"/><path d="M14 38h72"/>
           <path d="M24 50h34M24 62h24"/><circle cx="72" cy="56" r="7"/>`
  };

  return {
    icon: (name) => wrap(I[name] || I.card),
    names: Object.keys(I)
  };
})();
