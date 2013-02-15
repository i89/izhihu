/**
 * 问题页
 */

$(function(){
  if(pageIs.Question){

var $lblAnswerCount=$('#zh-question-meta-wrap')//answers_count
  , $reply=$('#zh-question-answer-form-wrap')//reply_form
  , ppWidth=0,ppHeight=400
  , $uno=$('<div>',{'class':'uno',style:'float:left'})//izh_AuthorsList
  , $ppT=$('<span>',{'class':'meT',style:'display:none'})//izh_AuthorsList_TopSelfIndicator
  , $frm=$('<div>',{'class':'frame'})//izh_AuthorsList_frame
  , $ppB=$('<span>',{'class':'meB',style:'display:none'})//izh_AuthorsList_BottomSelfIndicator
  , $pp=$('<ul>',{'class':'pp'})//izh_AuthorsList_UL
  , $ppI=$('<div>')
  , css_comment={
        'position':'fixed'
      , 'background-color':'#fff'
      , 'outline':'none'
    //, 'overflow':'auto'
      , 'z-index':'9'
      , 'right':10
      , 'border-radius':0
      , 'border':'1px solid #999999'
      , 'padding':'100px 0px 0px 10px'
    }
  ;

function showComment($ac,$cm){
    $('.zm-item-answer').not('[data-aid='+$ac.attr('data-aid')+']')
        .find('.zm-comment-box:visible').each(function(i,e){
            $(e).parent().children('[name=addcomment]')[0].click();
        });
    var $n=$ac.next(),$n=$n.length?$n:$ac.parent().next()
      , t=$ac.offset().top-$main.offset().top
      , b=$ac.offset().top-$main.offset().top
      , w=$ac.width()
      , h=$ac.height()+parseInt($ac.css('padding-bottom'))+parseInt($n.css('padding-top'));
    if(!$ac.find('.izh_tape_a,.izh_tape_b').length)
        $('<div class="izh_tape_a"></div><div class="izh_tape_b"></div>').appendTo($ac);
    if(!$cm)$cm=$ac.find('.zm-comment-box');
    if($cm.length){
        //if($cm.is(':hidden')){
            $ac.find('.izh_tape_a').css({
                'position':'absolute'
              , 'width':1
              , 'height':h//$cm.height()
              , 'top':0//$cm.offset().top
              , 'left':w-1//$cm.offset().left-1
              , 'z-index':'10'
              , 'background-color':'#fff'
            }).show();
            var $t=$cm.clone().css({'position':'absolute','z-index':'-1'}).appendTo($(document.body)).show();
            $cm.css({'left':$ac.offset().left+$ac.width()-1}).attr('tabindex','-1').focus();//.show();
            var th=$t.children('.zm-comment-list').css({'position':'absolute','height':'','top':'','bottom':''}).height()+100;
            if(th<window.innerHeight-$main.offset().top){
                var top=$ac.offset().top-$(document).scrollTop();
                if(top+th>window.innerHeight){
                    $cm.css({'top':0,'bottom':0});
                }else{
                    $cm.css({'top':top>$main.offset().top?top:$main.offset().top,'bottom':''});
                }
            }else{
                $cm.css({'top':$main.offset().top,'bottom':0});
            }
            $t.remove();
            $t=null;
            $('.mention-popup').attr('data-aid',$ac.attr('data-aid'));
        //}
    }else{
        $ac.find('.zu-question-answer-meta-comment')[0].click();
    }
    $ac.find('.izh_tape_b').css({
        'position':'absolute'
      , 'width':1
      , 'height':h
      , 'top':0
      , 'left':w
      , 'z-index':'8'
      , 'background-color':'#999999'
    }).show();
    $ac.css('border-color','#999999');
    $n.css('border-color','#999999');
    $('.zh-backtotop').css('visibility','hidden');
    $(document.body).scrollTop(t);
}
function hideComment($ac,$cm){
    var $n=$ac.next(),$n=$n.length?$n:$ac.parent().next();
    if(!$cm)$cm=$ac.find('.zm-comment-box');
    if($cm.length)
        //if($cm.is(':visible')){
            //$cm.hide();
            $ac.find('.izh_tape_a').hide();
        //}
    $ac.find('.izh_tape_b').hide();
    $ac.css('border-color','#DDDDDD');
    $n.css('border-color','#DDDDDD');
    $('.izh_tape_a:visible,.izh_tape_b:visible').hide();
    $('.zh-backtotop').css('visibility','visible');
}

function processAnswer($a){
    if(!$a||!$a.length)return;
    if($a.attr('izh_processed')=='1')return;
    var $c=$a.children().last()
      , $p=$a.find('.zm-item-answer-author-info')
      , $v=$a.find('.zu-question-answer-meta-fav');
    if($p.length){//relocatePersonInfo
        var $f=$('<a>',{name:$a.attr('data-aid')}).before($c);
        if(izhAuthorRear){
            $p.insertBefore($c).css('textAlign','right');
        }
        $p=$p.children().first().children().eq(1);
        if($a.length){
            var $ppla=$('<a>',{href:'#'+$a.attr('data-aid'),target:'_self'})
              , $ppl=$('<li>').append($ppla).appendTo($pp);
            if($a.attr('data-isowner')=='1'){
                _e=$a.get(0);
                $ppla.append('<span class="me"></span>');
            }
            var nameCSS='name';
            if($a.attr('data-isfriend')=='1'){
                nameCSS+=' friend';
            }
            if($a.attr('data-collapsed')=='1'){
                nameCSS+=' collapsed'
            }
            if(!$p.length){
                nameCSS+=' noname';
            }
            $('<span class="'+nameCSS+'"></span>').appendTo($ppla)
                .html(!$p.length?'匿名用户':$p.html());
            if ($ppl.width()>ppWidth)
                ppWidth=$ppl.width();
            $ppla.mouseover(function(){
                if(_e){
                    var $uno=$(this.parentNode.parentNode.parentNode.parentNode)
                      , $frm=$uno.children('.frame');
                    $uno.children('.meT').css('display',0>_e.offsetTop-$frm.scrollTop()?'':'none');
                    $uno.children('.meB').css('display',$frm.height()<_e.offsetTop-$frm.scrollTop()+_e.offsetHeight?'':'none');
                }
            });
            if(_e==$a.get(0)){
                _e=$ppla.get(0);
            }
        }
    }
    if($v.length){
        if($a.children('.izh_fav').length<=0){
            $('<div class="izh_fav">loading...</div>').bind('mouseover',function(){
                $(this).show();
            }).bind('mouseout',function(){
                $(this).hide();
            }).appendTo($a);
        }
        $v.bind('mouseover',function(){
            var $a=$(this).parentsUntil('#zh-question-answer-wrap','.zm-item-answer');
            $a.children('.izh_fav').css({
                'bottom':$(this).height()+$a.height()-$(this).position().top-1
              , 'left':$(this).position().left
            }).show();
            $.getJSON('http://www.zhihu.com/collections/json',$.param({answer_id:$a.attr('data-aid')}),function(result,status,xhr){
                var aid=this.url.substr(this.url.indexOf('answer_id=')+10)
                  , $a=$('.zm-item-answer[data-aid='+aid+']')
                  , $v=$a.children('.izh_fav').html('<div class="title">最近的选择</div>');
                $.each(result.msg[0].slice(0,4),function(i,e){
                    $('<a/>',{
                        'class':'fav'
                      , href:'javascript:;'
                      , aid:aid
                      , fid:e[0]
                      , html:e[1]
                    }).bind('click',function(){
                        var u='http://www.zhihu.com/collection/';
                        u+=$(this).hasClass('selected')?'remove':'add';
                        $.post(u,$.param({_xsrf:$('input[name=_xsrf]').val(),answer_id:$(this).attr('aid'),favlist_id:$(this).attr('fid')}),function(result){
                            var act=this.url.substring(this.url.lastIndexOf('/')+1)
                              , fid_i=this.data.indexOf('favlist_id=')
                              , fid=this.data.substring(fid_i+11)
                              , aid_i=this.data.indexOf('answer_id=')
                              , aid=this.data.substring(aid_i+10,fid_i-1)
                              , $vi=$('.zm-item-answer[data-aid='+aid+'] .izh_fav a[fid='+fid+']')
                              , inc=0;
                            if(act=='remove'&&result.msg=='OK'){
                                $vi.removeClass('selected');
                                inc=-1;
                            }else if(act=='add'&&result.msg.length){
                                $vi.addClass('selected');
                                inc=1;
                            }
                            if(inc!=0){
                                $vi.children('span').html(parseInt($vi.children('span').html())+inc);
                            }
                        });
                    }).appendTo($v).append($('<span/>',{html:e[3]}));
                });
                $.each(result.msg[1].slice(0,4),function(i,e){
                    $v.find('a.fav[fid='+e+']').addClass('selected');
                });
            });
        });
        $v.bind('mouseout',function(){
            var $a=$(this).parentsUntil('#zh-question-answer-wrap','.zm-item-answer');
            $a.children('.izh_fav').hide();
        });
    }
    $c.bind('DOMNodeInserted',function(event){
        var $cm=$(event.target);
        if($cm.is('.zm-comment-box')){
            if(izhShowComment){
                $cm.css(css_comment).parent().children('[name=addcomment]').on('click',function(event){
                    var $cm=$(this).parent().find('.zm-comment-box');
                    if($cm.length){
                        var $a=$(this).parents('.zm-item-answer');
                        if($cm.is(':hidden')){
                            showComment($a,$cm);
                        }else{
                            hideComment($a,$cm);
                        }
                    }
                });
                showComment($cm.parents('.zm-item-answer'),$cm);
                $('i.zm-comment-bubble',$cm).hide();
                $('.zm-comment-list',$cm).css({
                    'height':'100%'
                  , 'overflow':'auto'
                }).bind('DOMNodeInserted',function(event){
                    var $cm=$(this).parent();
                    if($cm.is(':visible')){
                        var $a=$cm.parents('.zm-item-answer');
                        showComment($a,$cm);
                        var $icm=$(event.target);
                        $icm.bind('DOMNodeRemoved',function(event){
                            var $cm=$(this).parent().parent();
                            if($cm.is(':visible')){
                                var $a=$cm.parents('.zm-item-answer');
                                showComment($a,$cm);
                            }
                        });
                    }
                }).children('.zm-item-comment').bind('DOMNodeRemoved',function(event){
                    var $cm=$(this).parent().parent();
                    if($cm.is(':visible')){
                        var $a=$cm.parents('.zm-item-answer');
                        showComment($a,$cm);
                    }
                });
                $('.zm-comment-form.zm-comment-box-ft',$cm).css({
                    'position':'absolute'
                  , 'top':0
                  , 'left':0
                  , 'right':0
                });
            }
            if(!$cm.hasClass('empty')&&$cm.children('a.zu-question-answer-meta-comment').length<=0){
                var $btnCC=$('<a class="zu-question-answer-meta-comment"><i class="z-icon-fold"></i>收起</a>')
                    .click(function(){
                        var $a=$(this).parents('.zm-item-answer');
                        hideComment($a);
                        $a.find('[name=addcomment]')[0].click();
                    });
                if(izhShowComment){
                    $btnCC.css({
                        'cursor':'pointer'
                      , 'position':'absolute'
                      , 'top':70
                    }).insertBefore($cm.children(':first'));
                }else{
                    $btnCC.css({
                        'float':'right'
                      , 'cursor':'pointer'
                      , 'margin-right':5
                    }).appendTo($cm);
                }
            }
        }
    });
    if(izhShowComment){
        var $b_cm=$a.find('.zu-question-answer-meta-comment').css({'display':'block','float':'right'})
          , bw=$b_cm[0].scrollWidth+parseInt($b_cm.css('margin-left'))+parseInt($b_cm.css('margin-right'));
        $b_cm.css({
          //  'position':'absolute'
          //, 'top':$b_cm.next().position().top
          //, 'left':$a.width()-bw
        });
    }
    $a.attr('izh_processed','1');
}

//答案按时间排序
    if(utils.getCfg('answer_orderByTime')){
      client.click('.zh-answers-filter-popup div[data-key=added_time]');
    }
    
    //process each answer
    var _e=null
      , $listAnswers=$('#zh-single-question .zm-item-answer');
    if($listAnswers&&$listAnswers.length){
        if(izhAuthorList){
            $uno.appendTo($banner);
            $ppT.appendTo($uno);
            $frm.appendTo($uno);
            $pp.appendTo($frm);
            $ppB.appendTo($uno);
            //uno.appendChild(ppI);
        }
        if(izhShowComment){
            $('#zh-question-collapsed-wrap').show();
        }
        $listAnswers.each(function(i,e){
            processAnswer($(e));
        });
        if($lblAnswerCount.length){
            var s=new Array()
              , $a=$('<a>')
              , $c=$('<span>',{'class':'zg-bull',html:'•'})
              , $p=$lblAnswerCount.children('a.meta-item:last');
            if(_e){
                s.push($(_e).attr('href'));
                $a.html('我的回答');
            }else if($reply.length){
                var id='new_answer'
                  , $b=$('<a>',{name:id}).before($reply.children().first());
                s.push('#draft');
                $a.html('我要回答');
            }
            $c.insertAfter($p);
            $a.attr('href',s.join('')).attr('target','_self')
                .insertAfter($c);
        }
        if(izhAuthorList){
            if($frm.get(0).scrollHeight>ppHeight){
                $frm.height(ppHeight);
                ppWidth+=15;
            }
            if($frm.get(0).scrollHeight>ppHeight){//To fix ul width for chrome
                ppWidth+=20;
            }
            $pp.width(ppWidth);
            $uno.css({
                'float':'none'
              , 'left':10-$frm.width()});
            $uno.mouseover(function(){
                $(this).css('left','0');
            });
            $uno.mouseout(function(){
                $(this).css('left',10-$(this).width());
            });
            if($reply.children('.zu-answer-form-disabled-wrap').is(':hidden')){
                var $ppla=$('<a>',{href:'#draft',target:'_self'})
                    .append('<table class="plus"><tr><td></td><td></td></tr><tr><td></td><td></td></tr></table>')
                    .append('<span class="name func">-new-</span>')
                  , $ppl=$('<li>')
                    .append($ppla)
                  , $pp=$('<ul>')
                    .append($ppl)
                    .appendTo($frm);
            }
            if(_e){
                $uno.children('.meT').css('display',0>_e.offsetTop-$frm.scrollTop()?'':'none');
                $uno.children('.meB').css('display',$frm.height()<_e.offsetTop-$frm.scrollTop()+_e.offsetHeight?'':'none');
            }
        }
    }
    var b_s=$('#zh-question-collapsed-switcher')
      , cn=!b_s.length||b_s.is(':hidden')?0:parseInt($('#zh-question-collapsed-num').text());
    if(isNaN(cn))cn=0;
    if(b_s.length)
        b_s[0].click();
    if(cn>0){
        $('#zh-question-collapsed-wrap').show().bind('DOMNodeInserted',function(event){
            var $a=$(event.target);
            if($a.is('.zm-item-answer')){
            	processAnswer($a);
            }
        });
    }
  }
})