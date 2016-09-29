# <h1>Page</h1>
<h3>My first Plugin.<br />
It is simple page plugin.</h3>

<h4>you should:</h4>
<div class="highlight highlight-text-html-basic">
<pre>
&lt;<span class="pl-ent">link</span> <span class="pl-e">rel</span>=<span class="pl-s"><span class="pl-pds">"</span>stylesheet<span class="pl-pds">"</span></span> <span class="pl-e">type</span>=<span class="pl-s"><span class="pl-pds">"</span>text/css<span class="pl-pds">"</span></span> <span class="pl-e">href</span>=<span class="pl-s"><span class="pl-pds">"</span>src/jquery.page.css<span class="pl-pds">"</span></span>&gt;
</pre>
</div>
or youself css;

<h4>you need put jquery before my plugin</h4>
<div class="highlight highlight-text-html-basic">
<pre>
&lt;<span class="pl-ent">script</span> <span class="pl-e">src</span>=<span class="pl-s"><span class="pl-pds">"</span>src/jquery.min.js<span class="pl-pds">"</span></span>&gt;&lt;/<span class="pl-ent">script</span>&gt;
&lt;<span class="pl-ent">script</span> <span class="pl-e">src</span>=<span class="pl-s"><span class="pl-pds">"</span>src/jquery.page.js<span class="pl-pds">"</span></span>&gt;&lt;/<span class="pl-ent">script</span>&gt;
</pre>
</div>

<h4>how to use：</h4>
<div class="highlight highlight-text-html-basic">
<pre>
$("#page").Page({
    totalPages: 14,//total Pages
    liNums: 7,//the li numbers(advice use odd)
    activeClass: 'activP', //active class style
    firstPage: '首页',//first button name
    lastPage: '末页',//last button name
    prv: '«',//prev button name
    next: '»',//next button name
    hasFirstPage: true,//whether has first button
    hasLastPage: true,//whether has last button
    hasPrv: true,//whether has prev button
    hasNext: true,//whether has next button
    callBack : function(page){
        //callBack function，page:active page
    }
});
</pre>
</div>
<h4>or see in demo :)</h4>
