/**
 * Share.js
 * @file share.js
 * @author @overtrue, @xiaowu修改
 */

(function ($) {

    /**
     * 实例化方法
     *
     * @param  {Object} options 配置参数
     *
     * @return {Object}          this
     */
    $.fn.share = function (options) {
        if (!$.isPlainObject(options)) {
            options = {};
        }

        options = $.extend({}, $.fn.share.defaults, options);

        return this.each(function () {
            var data = $(this).data();
            var $container;

            // 如果已经加载过
            if (data._share) {
                return;
            }

            // 打上标识
            data._share = true;

            // 合并配置，拿当前dom上的data-*来覆盖
            data = $.extend({}, options, data);

            // 添加类
            $container = $(this).addClass('share-component social-share');

            // 循环当前的站点
            $.each(getSites(data), function (index, name) {
                var $elem;

                // 如果已经初始化过dom，则查找这个dom
                if (data.initialized) {
                    $elem = $container.find('.icon-' + name);

                    // 如果dom不存在，则忽略
                    if (!$elem.length) {
                        return;
                    }
                }
                else {
                    $elem = $('<a class="social-share-icon icon-' + name + '" target="_blank"></a>');
                }

                // 设置链接
                $elem.attr('href', makeUrl(name, data));

                // 如果没有初始化过dom，则追加
                if (!data.initialized) {
                    $container.append($elem);
                }

                // 如果是微信浏览器,则追加二维码
                if (name === 'wechat') {
                    $elem.append([
                        '<div class="wechat-qrcode">',
                        '   <h4>' + data.wechatQrcodeTitle + '</h4>',
                        '   <div class="qrcode"></div>',
                        '   <div class="help">' + data.wechatQrcodeHelper + '</div>',
                        '</div>'
                    ].join('')).find('.qrcode').qrcode({
                        render: 'image',
                        size: 100,
                        text: data.url
                    });
                }

                $elem = null;
            });
        });
    };

    /**
     * 模板配置
     *
     * @type {Object}
     */
    $.fn.share.templates = {
        wechat: 'javascript:void(0);',
        qzone: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&desc={description}&summary={summary}&site={source}',
        qq: 'http://connect.qq.com/widget/shareqq/index.html?url={url}&title={title}&source={source}&desc={description}',
        tencent: 'http://share.v.t.qq.com/index.php?c=share&a=index&title={title}&url={url}&pic={image}',
        weibo: 'http://service.weibo.com/share/share.php?url={url}&title={title}&pic={image}',
        // wechat: 'javascript:;',
        douban: 'http://shuo.douban.com/!service/share?href={url}&name={title}&text={description}&image={image}&starid=0&aid=0&style=11',
        diandian: 'http://www.diandian.com/share?lo={url}&ti={title}&type=link',
        linkedin: 'http://www.linkedin.com/shareArticle?mini=true&ro=true&title={title}&url={url}&summary={summary}&source={source}&armin=armin',
        facebook: 'https://www.facebook.com/sharer/sharer.php?u={url}',
        twitter: 'https://twitter.com/intent/tweet?text={title}&url={url}&via={site_url}',
        google: 'https://plus.google.com/share?url={url}'
    };

    /**
     * 是否手机浏览器
     *
     * @type {Boolean}
     */
    $.fn.share.isMobile = !!navigator.userAgent.toLowerCase().match(/applewebkit.*mobile.*/);

    /**
     * 是否运行在微信浏览器
     *
     * @type {Boolean}
     */
    $.fn.share.isWeChat = !!navigator.userAgent.toLowerCase().match(/MicroMessenger/);

    var $head = $(document.head);
    /**
     * 默认配置
     *
     * @type {Object}
     */
    $.fn.share.defaults = {
        url: window.location.href,
        site_url: window.location.origin,
        source: $head.find('[name="site"]').attr('content') || $head.find('[name="Site"]').attr('content') || document.title,
        title: $head.find('[name="title"]').attr('content') || $head.find('[name="Title"]').attr('content') || document.title,
        description: $head.find('[name="description"]').attr('content') || $head.find('[name="Description"]').attr('content'),
        image: '',
        wechatQrcodeTitle: '微信扫一扫：分享',
        wechatQrcodeHelper: '<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>',
        mobileSites: null,
        sites: [
            'weibo',
            'qq',
            'wechat',
            'tencent',
            'douban',
            'qzone',
            'linkedin',
            'diandian',
            'facebook',
            'twitter',
            'google'
        ]
    };

    /**
     * 获取站点，会做数据容错
     *
     * @param {Object} data 配置数据
     *
     * @return {Array} 可用的站点列表
     */
    function getSites(data) {
        var sites = $.fn.share.isMobile ? data.mobileSites || data.sites : data.sites;

        if (typeof sites === 'string') {
            sites = sites.split(',');
        }

        // 筛选站点
        sites = sites.filter(function (name) {
            name = $.trim(name);

            // 如果为空或者站点没有配置模板则忽略
            if (!name || !$.fn.share.templates[name]) {
                return false;
            }

            // 如果当前在微信浏览器里运行并且站点名是微信则忽略
            if ($.fn.share.isWeChat && name === 'wechat') {
                return false;
            }

            return true;
        });

        // 如果筛选站点后为空，则使用默认值
        if (!sites.length) {
            sites = $.fn.share.defaults.sites;
        }

        return sites;
    }

    /**
     * 生成分享的跳转链接
     *
     * @param {string} name 站点名
     * @param {Object} data 配置数据对象
     *
     * @return {string} 最终链接
     */
    function makeUrl(name, data) {
        data.summary = data.description || '';

        return $.fn.share.templates[name].replace(/\{([^\}]+?)\}/g, function ($0, $1) {
            var value = data[name + $1.substr(0, 1).toUpperCase() + $1.substr(1)];

            if (value === undefined) {
                value = data[$1];
            }

            return encodeURIComponent(value || '');
        });
    }

    // Domready after initialization
    $(function () {
        $('.share-component, .social-share').share();

        // domready之后再获取图片链接
        $.fn.share.defaults.image = $('body').find('img').eq(0).attr('src');
    });
})(jQuery);
