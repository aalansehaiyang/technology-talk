module.exports = {
    port: "8080",
    dest: ".site",
    base: "/",
    // 是否开启默认预加载js
    shouldPrefetch: (file, type) => {
        return false;
    },
    // webpack 配置 https://vuepress.vuejs.org/zh/config/#chainwebpack
    chainWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            const dateTime = new Date().getTime();

            // 清除js版本号
            config.output.filename('assets/js/cg-[name].js?v=' + dateTime).end();
            config.output.chunkFilename('assets/js/cg-[name].js?v=' + dateTime).end();

            // 清除css版本号
            config.plugin('mini-css-extract-plugin').use(require('mini-css-extract-plugin'), [{
                filename: 'assets/css/[name].css?v=' + dateTime,
                chunkFilename: 'assets/css/[name].css?v=' + dateTime
            }]).end();

        }
    },
    markdown: {
        lineNumbers: true,
        externalLinks: {
            target: '_blank', rel: 'noopener noreferrer'
        }
    },
    locales: {
        "/": {
            lang: "zh-CN",
            title: "二进制跳动",
            description: "Java生态圈常用技术框架、开源中间件，Spring 全家桶、分布式架构、团队管理、大厂面试题、职场锦囊、读书单、个人成长、思考等知识"
        }
    },
    head: [
        // ico
        ["link", {rel: "icon", href: `/favicon.ico`}],
        // meta
        ["meta", {name: "robots", content: "all"}],
        ["meta", {name: "author", content: "Tom哥"}],
        ["meta", {"http-equiv": "Cache-Control", content: "no-cache, no-store, must-revalidate"}],
        ["meta", {"http-equiv": "Pragma", content: "no-cache"}],
        ["meta", {"http-equiv": "Expires", content: "0"}],
        ["meta", {
            name: "keywords",
            content: "Java生态圈常用技术框架、开源中间件，Spring 全家桶、分布式架构、团队管理、大厂面试题、职场锦囊、读书单、个人成长、思考等知识"
        }],
        ["meta", {name: "apple-mobile-web-app-capable", content: "yes"}],
        ['script',
            {
                charset: 'utf-8',
                async: 'async',
                // src: 'https://code.jquery.com/jquery-3.5.1.min.js',
                src: '/js/jquery.min.js',
            }],
        ['script',
            {
                charset: 'utf-8',
                async: 'async',
                // src: 'https://code.jquery.com/jquery-3.5.1.min.js',
                src: '/js/global.js',
            }],
        ['script',
            {
                charset: 'utf-8',
                async: 'async',
                src: '/js/fingerprint2.min.js',
            }],
        // ['script',
        //     {
        //         charset: 'utf-8',
        //         async: 'async',
        //         src: 'https://s9.cnzz.com/z_stat.php?id=1278232949&web_id=1278232949',
        //     }],
        // 添加百度统计
        ["script", {},
            `
              var _hmt = _hmt || [];
              (function() {
                var hm = document.createElement("script");
                hm.src = "https://hm.baidu.com/hm.js?eed7b6826268b05ccf1735d9b5d0e3dc";
                var s = document.getElementsByTagName("script")[0];
                s.parentNode.insertBefore(hm, s);
              })();
            `
        ]
    ],
    plugins: [
        [
            {globalUIComponents: ['LockArticle', 'PayArticle']}
        ],
        // ['@vssue/vuepress-plugin-vssue', {
        //     platform: 'github-v3', //v3的platform是github，v4的是github-v4
        //     // 其他的 Vssue 配置
        //     owner: 'fuzhengwei', //github账户名
        //     repo: 'CodeGuide', //github一个项目的名称
        //     clientId: 'df8beab2190bec20352a',//注册的Client ID
        //     clientSecret: '7eeeb4369d699c933f02a026ae8bb1e2a9c80e90',//注册的Client Secret
        //     autoCreateIssue: true // 自动创建评论，默认是false，最好开启，这样首次进入页面的时候就不用去点击创建评论的按钮了。
        // }
        // ],
        // ['@vuepress/back-to-top', true], replaced with inject page-sidebar
        ['@vuepress/medium-zoom', {
            selector: 'img:not(.nozoom)',
            // See: https://github.com/francoischalifour/medium-zoom#options
            options: {
                margin: 16
            }
        }],
        // https://v1.vuepress.vuejs.org/zh/plugin/official/plugin-pwa.html#%E9%80%89%E9%A1%B9
        // ['@vuepress/pwa', {
        //     serviceWorker: true,
        //     updatePopup: {
        //         '/': {
        //             message: "发现新内容可用",
        //             buttonText: "刷新"
        //         },
        //     }
        // }],
        // see: https://vuepress.github.io/zh/plugins/copyright/#%E5%AE%89%E8%A3%85
        // ['copyright', {
        //     noCopy: false, // 允许复制内容
        //     minLength: 100, // 如果长度超过 100 个字符
        //     authorName: "https://offercome.cn",
        //     clipboardComponent: "请注明文章出处, [offer 来了](https://offercome.cn)"
        // }],
        // see: https://github.com/ekoeryanto/vuepress-plugin-sitemap
        // ['sitemap', {
        //     hostname: 'https://offercome.cn'
        // }],
        // see: https://github.com/IOriens/vuepress-plugin-baidu-autopush
        ['vuepress-plugin-baidu-autopush', {}],
        // see: https://github.com/znicholasbrown/vuepress-plugin-code-copy
        ['vuepress-plugin-code-copy', {
            align: 'bottom',
            color: '#3eaf7c',
            successText: '代码已经复制到剪贴板'
        }],
        // see: https://github.com/tolking/vuepress-plugin-img-lazy
        ['img-lazy', {}],
        ["vuepress-plugin-tags", {
            type: 'default', // 标签预定义样式
            color: '#42b983',  // 标签字体颜色
            border: '1px solid #e2faef', // 标签边框颜色
            backgroundColor: '#f0faf5', // 标签背景颜色
            selector: '.page .content__default h1' // ^v1.0.1 你要将此标签渲染挂载到哪个元素后面？默认是第一个 H1 标签后面；
        }],
        // https://github.com/lorisleiva/vuepress-plugin-seo
        ["seo", {
            siteTitle: (_, $site) => $site.title,
            title: $page => $page.title,
            description: $page => $page.frontmatter.description,
            author: (_, $site) => $site.themeConfig.author,
            tags: $page => $page.frontmatter.tags,
            // twitterCard: _ => 'summary_large_image',
            type: $page => 'article',
            url: (_, $site, path) => ($site.themeConfig.domain || '') + path,
            image: ($page, $site) => $page.frontmatter.image && (($site.themeConfig.domain && !$page.frontmatter.image.startsWith('http') || '') + $page.frontmatter.image),
            publishedAt: $page => $page.frontmatter.date && new Date($page.frontmatter.date),
            modifiedAt: $page => $page.lastUpdated && new Date($page.lastUpdated),
        }]
    ],
    themeConfig: {
        // docsRepo: "aalansehaiyang/offercome",
        // 编辑文档的所在目录
        docsDir: 'docs',
        // 文档放在一个特定的分支下：
        docsBranch: 'master',
        //logo: "/logo.png",
        editLinks: true,
        sidebarDepth: 0,
        //smoothScroll: true,
        locales: {
            "/": {
                label: "简体中文",
                selectText: "Languages",
                editLinkText: "在 GitHub 上编辑此页",
                lastUpdated: "上次更新",
                nav: [
                    {
                        text: 'Spring全家桶', link: '/md/spring/springcloud/spring-cloud-alibaba.md'
                    },
                    {
                        text: '主流中间件',
                        items: [
                            {
                                text: 'Redis',
                                link:  '/md/middleware/redis/亿级系统的Redis缓存如何设计.md'
                            },
                            {
                                text: 'MySQL',
                                link: '/md/middleware/mysql/mysql 一棵 B+ 树能存多少条数据？.md'
                            },
                            {
                                text: 'MQ 消息队列',
                                link: '/md/middleware/mq/聊聊 Kafka 那点破事.md'
                            }
                        ]
                    },
                    {
                        text: '💎 分布式架构',
                        items: [
                            {
                                text: '🎡 系统架构',
                                link: '/md/arch/system/网关技术选型，为什么选择 Openresty.md'
                            },
                            {
                                text: '🏝 电商技术',
                                link: '/md/arch/business/电商系统架构， 常见的 9 个大坑.md'
                            },
                            {
                                text: '🏖 案例实战',
                                link: '/md/arch/case/借助流程引擎优化系统的复杂度.md'
                            },
                            {
                                text: '⛲ 设计模式',
                                link: '/md/arch/designmodel/软件设计模式系列（第一期）.md'
                            }
                        ]
                    },
                    {
                        text: '大厂面试专栏', link: '/md/interview/tech/JAVA基础那点破事.md'
                    },

                    {
                        text: '付费专栏',
                        items: [
                            {
                                text: '《系统架构与优化》',
                                link: '/md/pay/arch/optimize.md'
                            },
                            {
                                text: '《面试通关技巧》',
                                link: '/md/pay/interview/introductory.md'
                            },
                            {
                                text: '《职场锦囊》',
                                link: '/md/pay/job/001 |  职场遭遇老板 PUA，怎么办？.md'
                            }
                        ]
                    },
                    {
                        text: '🌍 知识星球', link: '/md/zsxq/Tom哥的知识星球.md'
                    },
                    {
                        text: '团队管理', link: '/md/team/manage/团队管理那点破事.md'
                    },
                    {
                        text: '开源框架精选', link: '/md/opensource/frame.md'
                    },

                    {
                        text: '读书单', link: '/md/about/book/读书单.md'
                    },
                    {
                        text: '公众号', link: 'https://www.yuque.com/tom666/daohang/ttrs0z'
                    },

                    {
                        text: '个人成长', link: '/md/about/grow_up/google_search.md'
                    }
                ],
                sidebar: {
                    "/md/team/": genTeam(),
                    "/md/middleware/": genMiddleware(),
                    "/md/opensource/": genOpensource(),
                    "/md/zsxq/": genZsxq(),
                    "/md/interview/": genInterview(),
                    "/md/spring/": genSpring(),
                    "/md/about/": genAbout(),
                    "/md/pay/arch/": genPayArch(),
                    "/md/pay/interview/": genPayInterview(),
                    "/md/pay/job/": genPayJob(),
                    "/md/arch/" :genArch()
                }
            }
        }
    }
};



// 分布式架构
function genArch() {
    return [
        {
            title: "系统架构",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "system/网关技术选型，为什么选择 Openresty.md",
                "system/gRPC 网关，针对 HTTP 2.0 长连接性能优化，提升吞吐量.md",
                "system/海量数据业务有哪些优化手段？.md",
                "system/人人都是架构师？！谈何容易！.md",
                "system/中台不是万能药！.md",
                "system/外部接口大量超时，把整个系统拖垮，引发雪崩！如何解决？熔断.md",
                "system/【高并发、高性能、高可用】系统设计经验.md",
                "system/OpenResty 实现限流.md",
                "system/如何设计一个高并发系统？.md",
                "system/为什么是 HTTP2 ，而不是HTTP2.0 ？.md"
            ]
        },
        {
            title: "电商技术",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "business/拆解零售商品架构的底层逻辑.md",
                "business/电商系统架构， 常见的 9 个大坑.md",
                "business/万级并发电商库存扣减如何设计？不超卖！.md",
                "business/电商订单自动确认收货的N种实现.md",
                "business/深入剖析优惠券核心架构设计.md",
                "business/如何玩好优惠券这把营销利剑？.md",
                "business/如何设计一个高性能的秒杀系统.md",
                "business/聊聊电商促销业务.md"
            ]
        },
        {
            title: "案例实战",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "case/借助流程引擎优化系统的复杂度.md",
                "case/Redis分布式锁.md",
                "case/Redis + Lua 组合实现分布式限流.md",
                "case/电商大促，「网站实时成交额」仪表大盘技术方案？.md",
                "case/电商平台的热点商品架构方案.md",
                "case/搞了个线上故障，被老板骂了.md"

            ]
        },
        {
            title: "设计模式",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "designmodel/软件设计模式系列（第一期）.md",
                "designmodel/软件设计模式系列（第二期）.md",
                "designmodel/软件设计模式系列（第三期）.md",
                "designmodel/学会这10个设计原则，离架构师又进了一步.md"
            ]
        }
    ];
}


// 《职场锦囊》
function genPayJob() {
    return [
        {
            title: "职场锦囊",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "001 |  职场遭遇老板 PUA，怎么办？.md",
                "002 |  与同事发生冲突怎么办？.md",
                "003 |  职场不相信眼泪，千万不要玻璃心 ？.md",
                "004 |  入职一家新公司，如何快速熟悉代码.md",
                "005 |  工作中，同事不配合怎么办？.md",
                "006 |  要想职场混的好，向上管理很重要.md",
                "007 |  离职后，一定要立刻找到新工作吗？.md",
                "008 |  空降领导如何做，才能平稳着陆？.md",
                "009 |  修炼心态，避免职场内耗！.md",
                "010 | 为什么程序员要修炼自己对外「沟通」能力？.md"
            ]
        }
    ];
}



// 《面试通关技巧》
function genPayInterview() {
    return [
        {
            title: "面试通关技巧",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "introductory.md",
                "第 1 讲：找工作有哪些渠道.md",
                "第 2 讲：如何挑选心仪公司？.md",
                "第 3 讲：JD 不是摆设，教你看懂岗位.md",
                "第 4 讲：什么时候跳槽最合适？.md",
                "第 5 讲：设计让面试官眼前一亮的简历？.md",
                "第 6 讲：怎么让面试官喜欢你？.md",
                "第 7 讲：面试中遇到不会的问题怎么办？.md",
                "第 8 讲：HR环节一般喜欢问哪些问题？.md",
                "第 9 讲：如何挑选最适合自己的 offer？.md",
                "第 10 讲：如何争取更高薪资？.md"
            ]
        }
    ];
}


// 《系统架构与优化》
function genPayArch() {
    return [
        {
            title: "系统架构与优化",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "optimize.md",
                "基础篇：为什么流量入口要部署网关？.md",
                "基础篇：负载均衡常用的 7 种算法.md",
                "架构篇：10 个架构原则，离架构师又进了一步.md",
                "架构篇：DDD如何指导微服务落地.md",
                "中间件：4 种主流 RPC 框架.md",
                "中间件：注册中心的 5 种技术选型.md",
                "中间件：缓存是性能优化的首选利器.md",
                "中间件：缓存的 7 大经典问题.md",
                "中间件：通过消息队列分担系统压力.md",
                "中间件：消息队列必问的 6 个经典问题.md",
                "中间件：ElasticSearch 解决复杂条件查询.md",
                "数据库：海量数据业务有哪些方案.md",
                "数据库：分布式主键 id 的 7 种生成策略.md",
                "数据库：分布式事务的 7 种技术方案.md",
                "数据库：SQL 优化 7 条经验总结.md",
                "代码篇：接口性能优化的 15 个技巧.md",
                "代码篇：接口幂等性的 8 种解决方案.md",
                "代码篇：学会13 种锁，从此不再为“锁”心烦.md",
                "代码篇：异步编程的 7 种实现方式.md",
                "提升篇：通过链路追踪优化慢请求.md",
                "提升篇：通过Arthas快速定位线上问题",
                "稳定性：限流的 4 种策略方案.md",
                "稳定性：系统高可用的 11 个方案技巧.md"
            ]
        }
    ];
}


// 团队管理
function genTeam() {
    return [
        {
            title: "团队管理",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "manage/团队管理那点破事.md",
                "manage/第一次带团队感觉很慌.md",
                "manage/管理者一定会遇到的那些事.md",
                "manage/如何打造一个高效的研发团队.md",
                "manage/作为技术团队TL，如何运用OKR提高团队产出.md",
                "manage/教你几招，如何快速把一个团队搞垮.md"
            ]
        }
    ];
}


// 大厂面试专栏
function genOpensource() {
    return [
        {
            title: "",
            collapsable: false,
            sidebarDepth: 2,
            children: [
                "frame.md"
            ]
        }
    ];
}

// 知识星球
function genZsxq() {
    return [
        {
            title: "",
            collapsable: false,
            sidebarDepth: 1,
            children: [
                "Tom哥的知识星球.md"
            ]
        }
    ];
}




// 主流中间件
function genMiddleware() {
    return [
        {
            title: "Redis",
            collapsable: true,
            sidebarDepth: 0,
            children: [
                "redis/亿级系统的Redis缓存如何设计.md",
                "redis/什么是布隆过滤器？如何解决高并发缓存穿透问题？.md",
                "redis/为什么Redis Cluster是16384个槽位.md",
                "redis/Redis主节点的Key已过期，但Client访问从节点依然可以读到过期数据.md",
                "redis/Redis 宕机，数据丢了，老板要辞退我.md",
                "redis/2米的大长图一文打尽 Redis 核心技术.md",
                "redis/Redis主节点宕机，要如何处理？.md",
                "redis/秒杀活动技术方案，Redis申请32个G，被技术总监挑战了.md",
                "redis/一下说出了 Redis 16 个常见使用场景，惊呆面试官.md",
                "redis/Redis Cluster集群，当master宕机，主从切换，客户端报错 timed out.md",
                "redis/如何解决 Redis 数据倾斜、热点等问题.md"
            ]
        },
        {
            title: "MySQL",
            collapsable: true,
            sidebarDepth: 0,
            children: [
                "mysql/mysql 一棵 B+ 树能存多少条数据？.md",
                "mysql/一张千万级的数据表，删除了一半的数据，你觉得B+树索引文件会不会变小？.md",
                "mysql/SQL 语句明明命中了索引，为什么执行很慢？.md",
                "mysql/跑了4个实验，实战讲解 MySQL的行锁、间隙锁.md",
                "mysql/讲一讲 MySQL 数据备份杀手锏 binlog.md",
                "mysql/拉取 binlog，自动同步数据.md",
                "mysql/MySQL 主备延迟有哪些坑？主备切换策略.md",
                "mysql/ MySQL 主从延迟 7 种解决方案.md",
                "mysql/SQL 优化有哪些技巧.md"
            ]
        },
        {
            title: "MQ 消息队列",
            collapsable: true,
            sidebarDepth: 0,
            children: [
                "mq/聊聊 Kafka 那点破事.md",
                "mq/Kafka 如何解决消息不丢失？",
                "mq/如何保证 MQ消息是有序的？",
                "mq/关于消息队列，面试官一般都会问哪些.md"
            ]
        }
    ];
}

// Spring 全家桶
function genSpring() {
    return [
        {
            title: "Spring Cloud",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "springcloud/spring-cloud-alibaba.md",
                "springcloud/spring-frame-compare.md"
            ]
        },
        {
            title: "Spring Boot",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "springboot/Mybatis.md",
                "springboot/Druid.md",
                "springboot/Redis.md",
                "springboot/Redis-safety.md",
                "springboot/ShardingSphere.md",
                "springboot/Guava.md",
                "springboot/Caffeine.md",
                "springboot/ElasticSearch.md",
                "springboot/Kafka.md",
                "springboot/Pulsar.md",
                "springboot/Apollo.md",
                "springboot/RabbitMQ.md",
                "springboot/Elastic-Job.md",
                "springboot/EhCache.md",
                "springboot/RocketMQ.md",
                "springboot/Nacos.md",
                "springboot/MongoDB.md",
                "springboot/Spring-Data-JPA.md",
                "springboot/OkHttp.md",
                "springboot/HttpClient.md",
                "springboot/gRPC.md",
                "springboot/Dubbo.md",
                "springboot/Seata.md"
            ]
        },
        {
            title: "Spring",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "spring/如何实现注解RPC Consumer属性动态注入.md",
                "spring/借助Proxy代理提升架构扩展性.md",
                "spring/统计代码块耗时的小工具.md"
            ]
        }
    ];
}

// 大厂面试专栏
function genInterview() {
    return [
        {
            title: "面试专题",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "tech/JAVA基础那点破事.md",
                "tech/JAVA集合那点破事.md",
                "tech/JAVA 并发那点破事.md",
                "tech/JVM 那点破事.md",
                "tech/项目亮点.md",
                "tech/面试那点破事.md",
                "tech/Redis 缓存那点破事.md",
                "tech/MySQL 那点破事.md",
                "tech/Mybatis 那点破事.md",
                "tech/Spring 那点破事.md",
                "tech/Spring Boot 那点破事.md",
                "tech/Spring Cloud 那点破事.md",
                "tech/MQ 那点破事.md",
                "tech/Kafka 那点破事.md",
                "tech/RocketMQ 那点破事.md",
                "tech/TCP 网络那点破事.md",
                "tech/操作系统那点破事.md",
                "tech/Docker 那点破事.md",
                "tech/Kubernetes 那点破事.md",
                "tech/Nginx 那点破事.md"
            ]
        },
        {
            title: "面试技巧",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                "skill/你离职的原因是什么？如何避坑？.md"
            ]
        }
    ];
}

// 关于自己
function genAbout() {
    return [
        {
            title: "个人成长",
            collapsable: false,
            sidebarDepth: 0,
            children: [
                // "me/about-me.md",
                "book/读书单.md",
                "grow_up/google_search.md",
                "grow_up/知识改变命运，读书改变生活.md",
                "grow_up/提高「程序员」的思维方式.md",
                "grow_up/入职一家新公司，如何快速熟悉代码？.md"

            ]
        }
    ];
}

