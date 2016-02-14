/**
 * @file share.js测试用例
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

describe('share.js', function () {
    var $div;

    var remove = function () {
        if ($div) {
            $div.remove();
            $div = null;
        }
    };

    var reset = function () {
        remove();
        $div = $('<div />');
    };

    afterEach(remove);

    beforeEach(reset);

    it('链式调用', function () {
        var flag = true;

        try {
            $div.width(1).height(1).share().width(1).height(1);
        }
        catch (e) {
            flag = false;
        }

        expect(flag).toBe(true);
    });

    it('参数测试', function () {
        $('.test1').share(false);
        $('.test2').share(null);
        $('.test3').share({});
        $('.test4').share('string');
        $('.test5').share(0);
    });

    it('dom结构测试', function () {
        $div.share();

        expect($div.children().length > 0).toBe(true);
        expect($div.children('a').length > 0).toBe(true);
        expect($div.children('.social-share-icon').length > 0).toBe(true);

        reset();
        $div.share({
            sites: 'weibo'
        });
        expect($div.children().length).toBe(1);
        expect($div.children('a').length).toBe(1);
        expect($div.children('.social-share-icon').length).toBe(1);
        expect($div.children('.icon-weibo').length).toBe(1);
    });

    it('option.sites', function () {
        $div.share({
            sites: []
        });

        // 传个空的sites的话会调用默认的
        expect($div.children().length).toBe($.fn.share.defaults.sites.length);

        reset();

        // 传个假的
        $div.share({
            sites: ['qqq', 123]
        });
        expect($div.children().length).toBe($.fn.share.defaults.sites.length);

        // 测试,分隔和空格
        reset();
        $div.share({
            sites: 'qq,test, ,  test'
        });
        expect($div.children().length).toBe(1);
    });

    it('微信浏览器测试', function () {
        $.fn.share.isWeChat = true;

        $div.share({
            sites: ['wechat']
        });
        expect($div.children().length).toBe($.fn.share.defaults.sites.length);

        $.fn.share.isWeChat = false;
        reset();
        $div.share({
            sites: ['wechat']
        });
        expect($div.children().length).toBe(1);
        expect($div.find('.qrcode').length).toBe(1);
    });

    it('initialized测试', function () {
        // 测试元素找不到
        $div.attr('data-initialized', 'true');
        $div.share({
            sites: 'weibo'
        });
        expect($div.find('.social-share-icon').length).toBe(0);

        // 测试元素找到
        reset();
        $div.data('initialized', true).attr('href', '#').html('<a class="icon-weibo"></a>');
        $div.share({
            sites: 'weibo'
        });
        expect($div.find('.icon-weibo').attr('href') !== '#').toBe(true);
    });

    it('空元素测试', function () {
        var flag = true;

        try {
            $('.aaa').width(1).height(1).share().width(1).height(1).share();
        }
        catch (e) {
            flag = false;
        }

        expect(flag).toBe(true);
    });

    it('移动站点测试', function () {
        $.fn.share.isMobile = true;

        // 移动端用 mobileSites
        $div.share({
            sites: 'qq',
            mobileSites: 'weibo'
        });
        expect($div.children().length).toBe(1);
        expect($div.find('.icon-weibo').length).toBe(1);

        reset();
        // 移动端mobileSites为空时使用sites字段
        $div.share({
            sites: 'qq',
            mobileSites: ''
        });
        expect($div.children().length).toBe(1);
        expect($div.find('.icon-qq').length).toBe(1);

        $.fn.share.isMobile = false;
    });

    it('配置参数覆盖测试', function () {
        $div.data({
            sites: 'weibo'
        }).share({
            sites: 'qq'
        });
        expect($div.find('.icon-weibo').length).toBe(1);

        reset();
        $div.data('wechatQrcodeHelper', '真心测试').share({
            wechatQrcodeHelper: '假心测试'
        });
        expect($div.html().indexOf('真心测试') !== -1).toBe(true);

        reset();
        $div.attr('data-wechat-qrcode-helper', 'xuexb').share();
        expect($div.html().indexOf('xuexb') !== -1).toBe(true);

        reset();
        $div.attr('data-sites', 'weibo').share({
            sites: 'qq'
        });
        expect($div.find('.icon-weibo').length).toBe(1);

        reset();
        $div.attr('data-qq-title', 'testok').share({
            sites: 'qq',
            title: 'test'
        });
        expect($div.html().indexOf('testok') !== -1).toBe(true);
    });

    // it('多次调用', function () {
    //     var flag = true;

    //     try {
    //         $div.share().share().share();
    //     }
    //     catch (e) {
    //         flag = false;
    //     }

    //     expect(flag).toBe(true);

    //     reset();
    //     $div.share({
    //         sites: 'weibo'
    //     }).share().share({
    //         sites: 'weibo,qq, google'
    //     });
    //     expect($div.children().length).toBe(1);
    // });

    // makeUrl测试
});
