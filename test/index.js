/**
 * @file share.js测试用例
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

describe('share.js', function () {
    it('链式调用', function () {
        expect($('<div />').appendTo('body').width(1).height(1).share().width(1).height(1)).toThrowError('测试');
    });

    // domready测试
    // 配置参数测试
    // 默认参数测试
});