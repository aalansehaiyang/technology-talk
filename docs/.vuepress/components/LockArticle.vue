<template>
    <div class="read-more-wrap"
         style="display: none; position: absolute; bottom: 0px; z-index: 9999; width: 100%; margin-top: -100px; font-family: PingFangSC-Regular, sans-serif;">
        <div id="read-more-mask"
             style="position: relative; height: 200px; background: -webkit-gradient(linear, 0 0%, 0 100%, from(rgba(255, 255, 255, 0)), to(rgb(255, 255, 255)));"></div>
        <a id="read-more-btn" target="_self"
           style="position: absolute; left: 50%; top: 70%; bottom: 30px; transform: translate(-50%, -50%); width: 160px; height: 36px; line-height: 36px; font-size: 15px; text-align: center; border: 1px solid rgb(222, 104, 109); color: rgb(222, 104, 109); background: rgb(255, 255, 255); cursor: pointer; border-radius: 6px;">阅读全文</a>

        <div id="btw-modal-wrap" style="display: none;">
            <div id="btw-mask"
                 style="position: fixed; top: 0px; right: 0px; bottom: 0px; left: 0px; opacity: 0.7; z-index: 999; background: rgb(0, 0, 0);"></div>
            <div id="btw-modal"
                 style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; text-align: center; font-size: 13px; background: rgb(255, 255, 255); border-radius: 10px; z-index: 9999; font-family: PingFangSC-Regular, sans-serif;">
            <span id="btw-modal-close-btn"
                  style="position: absolute; top: 5px; right: 15px; line-height: 34px; font-size: 34px; cursor: pointer; opacity: 0.2; z-index: 9999; color: rgb(0, 0, 0); background: none; border: none; outline: none;">×</span>
                <p id="btw-modal-header"
                   style="margin-top: 40px; line-height: 1.8; font-size: 13px;">
                    扫码或搜索：<span style="color: #E9405A; font-weight: bold;">微观技术</span>

                    <br>发送：<span id="fustack-token" class="token"
                                 style="color: #e9415a; font-weight: bold; font-size: 17px; margin-bottom: 45px;">290992</span>
                    <br>即可<span style="color: #e9415a; font-weight: bold;">立即永久</span>解锁本站全部文章</p>
                <img src="/images/personal/qrcode.jpg"
                     style="width: 180px; margin-top: 10px; margin-bottom: 30px; border: 8px solid rgb(230, 230, 230);">
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'LockArticle',
        data() {
            return {}
        },
        mounted: function () {
            // 定时任务
            setInterval(() => {
                if (this.isLock()) {
                    let $article = this.articleObj();
                    this._detect($article, this);
                }
            }, 1500);

            // 判断是否锁定文章
            // if (this.isLock()) {
            //     setTimeout(() => {
            //         let $article = this.articleObj();
            //         this._detect($article, this);
            //
            //         // 定时任务
            //         setInterval(() => {
            //             this._detect($article, this);
            //         }, 5000);
            //
            //     }, 2000);
            // }

        },
        methods: {
            isLock() {
                return "need" === this.$page.frontmatter.lock;
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

                let res = this.getCookie("_unlock");
                if ('success' === res) {
                    return;
                }

                t.getToken().then(function (token) {
                    $.ajax({
                        url: 'https://api.offercome.cn/interfaces/BlogApi.php',
                        type: "GET",
                        dataType: "text",
                        data: {
                            token: token
                        },
                        success: function (data) {
                            if (data === 'refuse') {
                                t._lock(articleObj);
                            } else {
                                t._unlock(articleObj);
                                t.setCookie("_unlock", "success", 7);
                            }
                        },
                        error: function (data) {
                            t._unlock(articleObj);
                        }
                    })
                });
            },
            _lock: function (articleObj) {
                let $article = articleObj.article;
                let height = articleObj.height;
                if ($article.length <= 0) return;

                // 文章隐藏后的高度
                let halfHeight = height * 0.3;

                // 篇幅短一点的文章就不需要解锁了
                if (this.os().isPc && halfHeight > 800) {

                    // 获取口令
                    this.getToken().then(function (token) {
                        $('#fustack-token').text(token);

                        // 判断是否已加锁
                        if ($article.hasClass("lock")) {
                            return;
                        }

                        // 设置文章可显示高度
                        $article.css({"height": halfHeight + 'px'});
                        $article.addClass('lock');

                        // 添加引导解锁标签
                        $article.remove("#read-more-wrap");

                        let clone = $('.read-more-wrap').clone();
                        clone.attr('id', 'read-more-wrap');
                        clone.css('display', 'block');

                        clone.find("#read-more-btn").click(function () {
                            clone.find("#btw-modal-wrap").css('display', 'block');
                        });

                        clone.find("#btw-modal-close-btn").click(function () {
                            clone.find("#btw-modal-wrap").css('display', 'none');
                        });

                        $article.append(clone);
                    });

                }
            },
            _unlock: function (articleObj) {

                let $article = articleObj.article;

                // 判断是否已加锁
                if (!$article.hasClass("lock")) {
                    return;
                }

                $article.css('height', 'initial');
                $article.removeClass('lock');

                $('#read-more-wrap').remove();

            },
            getToken: async function () {
				// 浏览器 Cookie true 不限制
				if(navigator.cookieEnabled){
					let value = this.getCookie('BAEID');
					if (!value) {
						return await this.getFingerprintId();
					}
					return value.substring(value.length - 6).toUpperCase();
				} else{
					return await this.getFingerprintId();
				}
                // return await this.getFingerprintId();
            },
            getFingerprintId: function () {
                // https://github.com/fingerprintjs/fingerprintjs
               /* new Fingerprint2().get(function(result, components){
                    let value = result.toUpperCase();
                    let token = value.substring(value.length - 6).toUpperCase();
                    // 设置token
                    $('#fustack-token').text(token);
                });
                return $('#fustack-token').text();*/
                return new Promise( resolve => {
                    new Fingerprint2().get(function(result, components){
                        let value = result.toUpperCase();
                        let token = value.substring(value.length - 6).toUpperCase();
                        resolve(token);
                    });
                })
            },
			getUUID: function () {
                return 'xxxxxx'.replace(/[xy]/g, function (c) {
                    let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            },
            getCookie: function (name) {
                let value = "; " + document.cookie;
                let parts = value.split("; " + name + "=");
                if (parts.length === 2)
                    return parts.pop().split(";").shift();
            },
            setCookie: function (name, value, hours){
                let exp = new Date();
                exp.setTime(exp.getTime() + hours*60*60*1000);
                // ;path=/ cookie全站有效
                document.cookie = name + "="+ escape (value) + ";path=/;expires=" + exp.toGMTString();
            },
            os: function () {
                let ua = navigator.userAgent,
                    isWindowsPhone = /(?:Windows Phone)/.test(ua),
                    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
                    isAndroid = /(?:Android)/.test(ua),
                    isFireFox = /(?:Firefox)/.test(ua),
                    isChrome = /(?:Chrome|CriOS)/.test(ua),
                    isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
                    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
                    isPc = !isPhone && !isAndroid && !isSymbian;
                return {
                    isTablet: isTablet,
                    isPhone: isPhone,
                    isAndroid: isAndroid,
                    isPc: isPc
                }
            }
        }

    }

</script>

<style lang="stylus">
    #read-more-btn {
        border: none !important;
        text-decoration: none;
        background: #3eaf7c !important;
    }

    #read-more-btn {
        color: #fff !important;
        transition: all .5s ease;
    }

    #read-more-btn:hover {
        background: #de3636 !important;
    }

    .lock {
        position: relative;
        overflow: hidden;
        padding-bottom: 30px;
    }
</style>

