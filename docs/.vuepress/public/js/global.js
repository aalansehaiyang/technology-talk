window.onload = function () {
    let $article = $('.theme-default-content > h1');
    if ($article.length <= 0) return null;

    let clientWidth = $article[0].clientWidth;

    // 根据ID获取iframe对象
    var ifr = document.getElementById('B-Video');

    if (ifr) {
        ifr.style.width = clientWidth + 'px';
        if (clientWidth < 450) {
            ifr.style.height = (523 * clientWidth) / 700 + 'px'
        } else {
            ifr.style.height = '450px'
        }
    }

};