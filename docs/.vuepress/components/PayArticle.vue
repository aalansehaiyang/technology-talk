<template>
    <div class="pay-read-more-wrap"
         style="display: none; position: absolute; bottom: 0px; z-index: 9999; width: 100%; margin-top: -100px; font-family: PingFangSC-Regular, sans-serif;">
        <div id="pay-read-more-mask"
             style="position: relative; height: 200px; background: -webkit-gradient(linear, 0 0%, 0 100%, from(rgba(255, 255, 255, 0)), to(rgb(255, 255, 255)));"></div>
        <a id="pay-read-more-btn" target="_blank"
           style="position: absolute; left: 50%; top: 70%; bottom: 30px; transform: translate(-50%, -50%); width: 160px; height: 36px; line-height: 36px; font-size: 15px; text-align: center; border: 1px solid rgb(222, 104, 109); color: rgb(222, 104, 109); background: rgb(255, 255, 255); cursor: pointer; border-radius: 6px;">付费阅读</a>
    </div>
</template>

<script>
    export default {
        name: 'PayArticle',
        data() {
            return {}
        },
        mounted: function () {

            // 延迟执行
            setTimeout(() => {
                if (this.isPay()) {
                    let $article = this.articleObj();
                    this._detect($article, this);
                }
            }, 150);

            // 定时任务
            let interval = setInterval(() => {
                if (this.isPay()) {
                    let $article = this.articleObj();
                    // if ($article && $article.article.hasClass("lock-pay")){
                    //     clearInterval(interval);
                    // }
                    this._detect($article, this);
                }
            }, 1000);
        },
        methods: {
            isPay() {
                return this.$page.frontmatter.pay;
            },
            articleObj: function () {
                let $article = $('.theme-default-content');
                if ($article.length <= 0) return null;

                // 文章的实际高度
                let height = $article[0].clientHeight;

                return {
                    article: $article,
                    height: height
                }
            },
            _detect: function (articleObj, t) {
                if (null == articleObj) return;

                let $article = articleObj.article;
                let height = articleObj.height;
                if ($article.length <= 0) return;

                // 文章隐藏后的高度
                let halfHeight = height * 0.9;

                // 判断是否已加锁
                if ($article.hasClass("lock-pay")) {
                    return;
                }

                // 设置文章可显示高度
                $article.css({"height": halfHeight + 'px'});
                $article.addClass('lock-pay');

                // 删除原有标签
                $article.remove("#pay-read-more-wrap");

                // 添加加锁标签
                let clone = $('.pay-read-more-wrap').clone();
                clone.attr('id', 'pay-read-more-wrap');
                clone.css('display', 'block');

                // 按钮跳转付费
                clone.find("#pay-read-more-btn").attr("href", this.$page.frontmatter.pay);

                $article.append(clone);
            }
        }
    }
</script>

<style lang="stylus">
    #pay-read-more-btn {
        border: none !important;
        text-decoration: none;
        background: #3eaf7c !important;
    }

    #pay-read-more-btn {
        color: #fff !important;
        transition: all .5s ease;
    }

    #pay-read-more-btn:hover {
        background: #de3636 !important;
    }

    .lock-pay {
        position: relative;
        overflow: hidden;
        padding-bottom: 30px;
    }
</style>