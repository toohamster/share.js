/**
 * Share.js
 */

(function ($) {

    /**
     * 是否为移动设备
     *
     * @type {Boolean}
     */
    var isMobileScreen = $(window).width() <= 768;

    /**
     * 是否运行在微信浏览器
     *
     * @type {Boolean}
     */
    var runningInWeChat = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) === 'micromessenger';

    /**
     * 模板配置
     *
     * @type {Object}
     */
    var templates = {
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
        google: 'https://plus.google.com/share?url={url}',
    };

    $.fn.share = function ($options) {
        if (!$.isPlainObject($options)) {
            $options = {};
        }

        $options = $.extend({}, $.fn.share.defaults, $options);

        return this.each(function () {
            var data = $.extend({}, $options, $(this).data());
            var $container = $(this).addClass('share-component').addClass('social-share');

            $.each(getSites(data), function (index, name) {
                var url = makeUrl(name, data);
                var $elem;

                if (data.initialized) {
                    $elem = $container.find('.icon-' + name);
                }
                else {
                    $elem = $('<a class="social-share-icon icon-' + name + '" target="_blank"></a>');
                }

                if (!$elem.length) {
                    return;
                }

                $elem.attr('href', url);

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
     * Get available site lists.
     *
     * @param {Array} data
     *
     * @return {Array}
     */
    function getSites(data) {
        var sites = isMobileScreen ? data.mobileSites || data.sites : data.sites;

        if (typeof sites === 'string') {
            sites = sites.split(',');
        }

        sites = sites.filter(function (name) {
            if (!name || !templates[name]) {
                return false;
            }

            if (runningInWeChat && name === 'wechat') {
                return false;
            }
        });

        if (!sites.length) {
            sites = $.fn.share.defaults.sites;
        }

        return sites;
    }

    /**
     * Build the url of icon.
     *
     * @param {String} name
     * @param {Object} data
     *
     * @return {String}
     */
    function makeUrl(name, data) {
        data['summary'] = data['description'];

        return templates[name].replace(/\{([^\}]+?)\}/g, function ($0, $1) {
            return data[$1] !== undefined ? encodeURIComponent(data[$1]) : '';
        });
    }

    /**
     * 默认配置
     *
     * @type {Object}
     */
    $.fn.share.defaults = {
        url: window.location.href,
        site_url: window.location.origin,
        source: $(document.head).find('[name="site"]').attr('content') || $(document.head).find('[name="Site"]').attr('content') || document.title,
        title: $(document.head).find('[name="title"]').attr('content') || $(document.head).find('[name="Title"]').attr('content') || document.title,
        description: $(document.head).find('[name="description"]').attr('content') || $(document.head).find('[name="Description"]').attr('content'),
        image: $(document).find('img:first').attr('src'),
        wechatQrcodeTitle: '微信扫一扫：分享',
        wechatQrcodeHelper: '<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>',
        mobileSites: [],
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

    // Domready after initialization
    $(function () {
        $('.share-component,.social-share').share();
    });
})(jQuery);
