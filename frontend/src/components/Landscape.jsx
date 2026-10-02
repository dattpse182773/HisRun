export default function Landscape() {
  return <svg className="landscape" viewBox="0 0 1000 800" role="img" aria-label="Minh họa nguyên bản: nhà thám hiểm trên con đường qua ruộng lúa, núi xanh và làng quê Việt Nam">
    <defs><linearGradient id="sky" x2="0" y2="1"><stop stopColor="#beddd6"/><stop offset="1" stopColor="#e5edcc"/></linearGradient><linearGradient id="rice" x2="0" y2="1"><stop stopColor="#94b366"/><stop offset="1" stopColor="#416c48"/></linearGradient><linearGradient id="road" x2="0" y2="1"><stop stopColor="#f8df9e"/><stop offset="1" stopColor="#d79f58"/></linearGradient></defs>
    <rect width="1000" height="800" fill="url(#sky)"/><circle cx="750" cy="155" r="77" fill="#fff5c8"/>
    <g fill="#f6f6df" opacity=".7"><ellipse cx="288" cy="131" rx="100" ry="18"/><ellipse cx="233" cy="117" rx="49" ry="25"/><ellipse cx="914" cy="235" rx="112" ry="17"/></g>
    <path d="M0 421 68 323Q100 280 132 335L175 274Q210 214 251 284L313 380 380 298Q410 265 448 312L512 419 640 245Q673 178 704 233L749 352 802 272Q831 231 852 296L931 404 1000 366V650H0Z" fill="#82afa0"/>
    <path d="M0 441 124 380 241 450 343 371 458 452 600 390 710 447 867 364 1000 409V630H0Z" fill="#618f77"/>
    <path d="M0 490Q280 396 570 478T1000 457V800H0Z" fill="url(#rice)"/>
    <g fill="none" stroke="#bed18b" strokeWidth="12" opacity=".65"><path d="M0 524Q250 441 574 510T1000 511"/><path d="M0 575Q260 493 550 555T1000 567"/><path d="M0 645Q263 564 540 620T1000 631"/><path d="M0 737Q265 642 556 706T1000 721"/></g>
    <path d="M547 444C520 503 703 519 636 590S410 678 434 800H727C652 684 797 638 740 568S567 496 574 444Z" fill="url(#road)"/>
    <path d="M560 481Q576 509 644 529M659 645 688 649M528 757 569 772" fill="none" stroke="#b78853" strokeWidth="5" opacity=".45"/>
    <g transform="translate(209 412)"><path d="M-60 24H75V111H-60Z" fill="#ead8a7"/><path d="M-88 31 7-38 101 31Z" fill="#a26343"/><path d="M-88 31 7-24 101 31" fill="none" stroke="#754c37" strokeWidth="9"/><rect x="-15" y="56" width="33" height="55" fill="#536344"/><rect x="39" y="51" width="20" height="24" fill="#536344"/></g>
    <g transform="translate(891 332)"><path d="M0 29 -12 301H12L17 35Z" fill="#765838"/><path d="M4 40Q-116-40-132 69  -52 23 4 40M4 40Q-59-101 27-82 17-10 4 40M4 40Q94-60 115 24 66 13 4 40M4 40Q122 51 98 112 61 62 4 40" fill="#326d51"/></g>
    <g transform="translate(576 571) rotate(5)"><ellipse cy="124" rx="54" ry="13" fill="#795d37" opacity=".2"/><path d="M-24 63-34 111-9 118 5 75M11 66 28 113 50 105 36 56" fill="#264d49"/><path d="M-35 104-47 119Q-45 128-14 125L-9 115M28 108 37 121 61 114Q64 101 46 102" fill="#f4ebce"/><rect x="-40" y="5" width="73" height="69" rx="17" fill="#e58743"/><rect x="-37" y="17" width="24" height="47" rx="8" fill="#bb6639"/><path d="M-27 16-52 50-43 58-12 37M28 13 48 37 63 20" fill="none" stroke="#eeb681" strokeWidth="15" strokeLinecap="round"/><circle cy="-18" r="28" fill="#efc192"/><path d="M-27-25Q-21-53 9-47 34-43 31-18Z" fill="#214d44"/><ellipse cx="1" cy="-28" rx="41" ry="9" fill="#285c4b"/><path d="M-22-32 27-32" stroke="#e2bc64" strokeWidth="7"/><circle cx="17" cy="-13" r="3" fill="#27443b"/><path d="M12 2 23-1" stroke="#a66044" strokeWidth="3"/><path d="M-11 12-6 68" stroke="#ffcc76" strokeWidth="7"/></g>
    <g fill="#edc75e" stroke="#fff0ad" strokeWidth="5"><ellipse cx="645" cy="554" rx="12" ry="17"/><ellipse cx="686" cy="583" rx="15" ry="20"/><ellipse cx="706" cy="627" rx="18" ry="23"/></g>
    <g fill="#315f45"><path d="M0 705Q81 641 153 711L202 800H0Z"/><path d="M798 800Q833 714 892 726 944 652 1000 696V800Z"/></g>
    <g stroke="#669151" strokeWidth="5" fill="none"><path d="M69 800 51 737M69 780 26 754M69 783 103 744M930 800 938 747M938 778 968 755"/></g>
    <g fill="none" stroke="#496d61" strokeWidth="3" strokeLinecap="round"><path d="M459 157q10-12 20 0 10-12 20 0M533 185q8-10 16 0 8-10 16 0"/></g>
  </svg>;
}
