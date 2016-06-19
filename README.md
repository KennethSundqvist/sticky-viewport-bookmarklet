# Sticky Viewport bookmarklet

Sometimes you want to see how an element behaves across breakpoints in a
responsive design, but as you resize the browser window the element moves out of
the viewport. Very frustrating!

This bookmarklet lets you mark an element as being "sticky" so that is it always
centered in the viewport as you resize the browser window.

## Install

1. Drag this link to your bookmarks toolbar: [Sticky Viewport][bookmarklet-url]
2. The bookmarklet is now "installed" and you can click on the button in the
   toolbar to run it

[bookmarklet-url]: javascript:(function()%7Bfunction%20t(t%2Ce%2Ci%2Cn)%7Be%5B(t%3F%22add%22%3A%22remove%22)%2B%22EventListener%22%5D(i%2Cn%2C!1)%7Dfunction%20e(t)%7Breturn%20B%3FB(t)%3AsetTimeout(t%2C1e3%2F60)%7Dfunction%20i(t)%7BS%3FS(t)%3AclearTimeout(t)%7Dfunction%20n(t)%7Bt.stopPropagation()%2Cw.picking%3Fs()%3Aw.sticky%26%26u()%7Dfunction%20o(t)%7Bw.picking%26%26t.keyCode%3D%3D%3DD%26%26k()%7Dfunction%20r(t)%7Bw.picking%26%26t.keyCode%3D%3D%3D_%3Fs()%3At.keyCode%3D%3D%3DD%26%26x()%7Dfunction%20l()%7BE%26%26i(E)%2CE%3De(f)%7Dfunction%20a()%7Bw.picking%3D!0%2CP.textContent%3D%22Cancel%20picking%22%2CH.appendChild(q)%2CH.appendChild(P)%2Ct(1%2CH%2C%22mousemove%22%2Cm)%2Ct(1%2CH%2C%22click%22%2Cp)%2Ct(1%2Cb%2C%22keydown%22%2Co)%2Ct(1%2Cb%2C%22keyup%22%2Cr)%7Dfunction%20s()%7Bw.picking%3D!1%2Cc()%2Ch()%2Cw.sticky%3FP.textContent%3D%22Unsticky%22%3AH.removeChild(P)%7Dfunction%20c()%7Bt(0%2CH%2C%22mousemove%22%2Cm)%2Ct(0%2CH%2C%22click%22%2Cp)%2Ct(0%2Cb%2C%22keydown%22%2Co)%2Ct(0%2Cb%2C%22keyup%22%2Cr)%7Dfunction%20p(e)%7Bvar%20i%3De.target%3Be.preventDefault()%2Ce.stopImmediatePropagation()%2Ci!%3D%3DH%26%26(w.picking%3D!1%2Cw.sticky%7C%7C(w.sticky%3D!0%2Ct(1%2Cb%2C%22resize%22%2Cl))%2CT%3Di%3D%3D%3Dq%3FA%3Ai%2Cc()%2Cx()%2Ch()%2CP.textContent%3D%22Unsticky%22)%7Dfunction%20u()%7Bw.sticky%3D!1%2CT%3Dnull%2Ct(0%2Cb%2C%22resize%22%2Cl)%2CH.removeChild(P)%7Dfunction%20f()%7Bvar%20t%2Ce%2Ci%2Cn%2Co%2Cr%2Cl%3DT%2Ca%3DT%3Bif(%22fixed%22%3D%3D%3Db.getComputedStyle(l).position)t%3Dl.offsetTop%2BH.scrollTop%2Ce%3Dl.offsetHeight%2CH.scrollTop%3DMath.round(t-(b.innerHeight-e)%2F2)%3Belse%20for(%3Bl%26%26l!%3D%3DH%26%26(i%3Dl.parentElement)%3B)n%3Di%3D%3D%3DH%3Fb.innerHeight%3Ai.clientHeight%2Cn%3Ci.scrollHeight%26%26(o%3Di.scrollTop%2Cr%3Do%2B(o%3E0%3F-1%3A1)%2Ci.scrollTop%3Dr%2Ci.scrollTop%3D%3D%3Dr%26%26(i.scrollTop%3D0%2Ct%3Dd(a)-d(i)%2Ce%3Da.offsetHeight%2Ci.scrollTop%3Dt%2Be%2F2-n%2F2%2Ca%3Di))%2Cl%3Di%3BE%3Dnull%7Dfunction%20d(t)%7Bfor(var%20e%3D0%3Bt%3B)e%2B%3Dt.offsetTop%2Ct%3Dt.offsetParent%3Breturn%20e%7Dfunction%20h()%7Bv(q%2Cq%2C%7Btop%3A-20%2Cleft%3A-20%2Cwidth%3A40%2Cheight%3A40%7D)%2Cy(%220%22)%2CsetTimeout(function()%7BH.removeChild(q)%2CR.display%3D%22none%22%2Cw.highlighting%3D!1%7D%2CU)%7Dfunction%20m(t)%7Bvar%20n%3Dt.target%3Bn!%3D%3DA%26%26n!%3D%3DH%26%26n!%3D%3Dq%26%26n!%3D%3DP%26%26(A%3Dn%2Cz%26%26i(z)%2Cz%3De(g))%7Dfunction%20g()%7Bv(q%2CA%2C%7B%7D)%2Cw.highlighting%7C%7C(w.highlighting%3D!0%2CR.display%3D%22block%22%2Ce(y))%2Cz%3Dnull%7Dfunction%20k()%7BR.pointerEvents%3D%22%22%2Cy(%221%22)%7Dfunction%20x()%7BR.pointerEvents%3D%22none%22%2Cy()%7Dfunction%20y(t)%7BR.opacity%3D%22string%22%3D%3Dtypeof%20t%3Ft%3A%220.5%22%7Dfunction%20v(t%2Ce%2Ci)%7Bvar%20n%3De.getBoundingClientRect()%2Co%3Dt.style%3Bo.top%3Dn.top%2B(i.top%7C%7C0)%2B%22px%22%2Co.left%3Dn.left%2B(i.left%7C%7C0)%2B%22px%22%2Co.width%3Dn.width%2B(i.width%7C%7C0)%2B%22px%22%2Co.height%3Dn.height%2B(i.height%7C%7C0)%2B%22px%22%7Dvar%20b%3Dwindow%2CC%3D%22_SVB_%22%2Cw%3Db%5BC%5D%3Db%5BC%5D%7C%7C%7Binitialized%3A!1%2Cpicking%3A!1%2Csticky%3A!1%2Chighlighting%3A!1%7D%3Bif(!w.picking)%7Bif(w.initialized)return%20void%20w.pickElement()%3Bvar%20T%2CA%2Cz%2CE%2CF%3Db.document%2CH%3DF.body%2Cq%3DF.createElement(%22div%22)%2CR%3Dq.style%2CP%3DF.createElement(%22button%22)%2CB%3DrequestAnimationFrame%7C%7CwebkitRequestAnimationFrame%7C%7CmozRequestAnimationFrame%7C%7CmsRequestAnimationFrame%2CS%3DcancelAnimationFrame%7C%7CwebkitCancelAnimationFrame%7C%7CmozCancelAnimationFrame%7C%7CmsCancelAnimationFrame%2CU%3D350%2C_%3D27%2CD%3D18%2CI%3D%22z-index%3A999999999%3Bposition%3Afixed%3B-webkit-transform%3Atranslate3d(0%2C0%2C0)%3B-moz-transform%3Atranslate3d(0%2C0%2C0)%3Btransform%3Atranslate3d(0%2C0%2C0)%3Bcursor%3Apointer%3Bborder-radius%3A3px%3B%22%3Bq.setAttribute(%22style%22%2C%22-webkit-transition%3Aall%20%22%2BU%2F1e3%2B%22s%20ease-out%3Btransition%3Aall%20%22%2BU%2F1e3%2B%22s%20ease-out%3Bdisplay%3Anone%3Bpointer-events%3Anone%3Bopacity%3A0%3Bbackground%3Ahsla(199%2C100%25%2C55%25%2C.4)%3Bborder%3A1px%20solid%20hsla(199%2C100%25%2C55%25%2C.6)%3Bbox-shadow%3A0%200%206px%20hsla(199%2C100%25%2C55%25%2C.4)%2Cinset%200%200%2015px%20hsla(199%2C100%25%2C55%25%2C.14)%3B%22%2BI)%2CP.setAttribute(%22style%22%2C%22top%3A15px%3Bleft%3A15px%3Bcolor%3A%23fee%3Bbackground%3Ahsl(199%2C100%25%2C55%25)%3Bborder%3A1px%20solid%20hsl(199%2C85%25%2C35%25)%3Bbox-shadow%3A0%201px%205px%20hsla(199%2C100%25%2C20%25%2C.4)%2Cinset%200%20-1px%203px%201px%20rgba(0%2C0%2C0%2C.15)%3Btext-shadow%3A0%201px%202px%20rgba(0%2C0%2C0%2C.2)%3B%22%2BI)%2Ct(1%2CP%2C%22click%22%2Cn)%2Ca()%2Cw.initialized%3D!0%2Cw.pickElement%3Da%7D%7D())

## How to use

1. Navigate to the page you want to use it on
2. Click on the _Sticky Viewport_ button in your toolbar
3. Move your mouse over the element that want to make sticky
4. Click on the highlighted element to make it sticky
    * Try `Alt+Click` if the element captures the click and prevents it from 
    doing the sticky business
5. Resize the browser window so the layout changes and watch the sticky element
   stay in the center of the viewport

## License

MIT
