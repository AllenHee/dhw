$(function() {
  var temp; // 解决城市重复选择的bug
  // 初始化地图
  require.config({
    paths: {
      echarts: 'http://echarts.baidu.com/build/dist'
    }
  });
  require(
    [
      'echarts',
      'echarts/chart/map'
    ],
    function (ec) {
      // 基于准备好的dom，初始化echarts图表
      var myChart = ec.init(document.getElementById('mapContent')); 
      var option = {
        tooltip : {
          trigger: 'item',
          formatter: '{b}'
        },
        series : [
          {
            name: '中国',
            type: 'map',
            mapType: 'china',
            selectedMode : 'single',
            itemStyle:{
              normal:{label:{show:true}},
              emphasis:{label:{show:true}}
            },
            data:[]
          }
        ]
      };
      var ecConfig = require('echarts/config');
      var zrEvent = require('zrender/tool/event');
      var curIndx = 0;
      var mapType = [
        'china',
        // 23个省
        '广东', '青海', '四川', '海南', '陕西', 
        '甘肃', '云南', '湖南', '湖北', '黑龙江',
        '贵州', '山东', '江西', '河南', '河北',
        '山西', '安徽', '福建', '浙江', '江苏', 
        '吉林', '辽宁', '台湾',
        // 5个自治区
        '新疆', '广西', '宁夏', '内蒙古', '西藏', 
        // 4个直辖市
        '北京', '天津', '上海', '重庆',
        // 2个特别行政区
        '香港', '澳门'
      ];
      myChart.on(ecConfig.EVENT.MAP_SELECTED, function (param) {
        var len = mapType.length;
        var mt = mapType[curIndx % len];
        if (mt == 'china') {
          // 全国选择时指定到选中的省份
          var selected = param.selected;
          for (var i in selected) {
            if (selected[i]) {
              mt = i;
              while (len--) {
                if (mapType[len] == mt) {
                  curIndx = len;
                }
              }
              break;
            }
          }
          // option.title.text = mt;
          // option.series[0].itemStyle.normal.label.show = true;
          // option.series[0].itemStyle.emphasis.label.show = true;
          if (mt != '南海诸岛') {
            $(".map_back").show();
            
          }
        } else {
          // curIndx = 0;
          // mt = 'china';
          selected = param.selected;
          var city = '';
          for (var str in selected) {
            if (selected[str]) {
              city = str;
            }
          }
          
          // 查询时要传递的参数
          var para = {};
          para.prov = mt;
          if (city != "") {
            para.city = city;
            temp = city
          } else {
            para.city = temp;
          }
          
          // 弹出层
          if (para.prov != "台湾") {
            console.log(para);
            loadData(para);
          }
        }
        option.series[0].mapType = mt;
        myChart.setOption(option, true);
        
        // 返回全国地图
        $(".map_back").click(function() {
          curIndx = 0;
          mt = 'china';
          option.series[0].mapType = mt;
          // option.series[0].itemStyle.normal.label.show = false;
          // option.series[0].itemStyle.emphasis.label.show = false;
          myChart.setOption(option);
          $(this).hide();
        });
      });
      
      option = {
        // tooltip : {
        //   show: true,
        //   trigger: 'item',
        //   formatter: '{b}'
        // },
        series : [
          {
            name: '随机数据',
            type: 'map',
            mapType: 'china',
            selectedMode : 'single',
            itemStyle:{
              normal:{
                borderWidth: 2,
                borderColor: '#fff',
                label: {
                  show: true,
                  textStyle: {
                    color: '#888',
                    // fontWeight: 700,
                    fontFamily: 'Microsoft Yahei", "simsun", sans-serif'
                  }
                }
              },
              emphasis:{
                borderWidth: 2,
                borderColor: '#fff',
                color: '#0097e0',
                label: {
                  show: true,
                  textStyle: {
                    color: '#333',
                    // fontWeight: 700,
                    fontFamily: '"Microsoft Yahei", "simsun", sans-serif'
                  }
                }
              }
            },
            data:[]
          }
        ]
      };
      
      myChart.setOption(option);
    });
    
  
  // 关闭弹出层
  $(".mapPop_closeBtn").click(function() {
    $(".mapPop").fadeOut();
    $(".mapPop_grey").fadeOut();
  });
  
  
  // 省市选择
  (function() {
    // 切换标签
    $(".slct_cnt_list_tab").click(function() {
      $(".slct_cnt_list_tab").removeClass("current");
      $(this).addClass("current");
      
      var index = $(this).index();
      $(".slct_cnt_list_item_wrap").removeClass("current");
      $(".slct_cnt_list_item_wrap").eq(index).addClass("current");
    });
    
    // 查询时要传递的参数
    var para = {};
    
    // 弹出和关闭选择框
    $(".slct_cnt_input_wrap").click(function(event) {
      var e = event || window.event;
      e.stopPropagation();
      $(".slct_cnt").show();
    });
    
    $(".slct_cnt_close").click(function() {
      $(".slct_cnt").hide();
    })
    $("body").click(function() {
      $(".slct_cnt").hide();
    });
    $(".slct_cnt").click(function(event) {
      var e = event || window.event;
      e.stopPropagation();
    })
    
    // 获取省市数据
    $.getJSON("../scripts/city.min.js", function(json) {
      // 填充省份数据
      var provs_html = ""
      for (var i=0; i<json.citylist.length; i++) {
        if (json.citylist[i]["p"] != "国外" && json.citylist[i]["p"] != "台湾") {
          provs_html += ("<li>" + json.citylist[i]["p"] + "</li>");
        }
      }
      $(".slct_cnt_list_item-provs").html(provs_html);
      // 点击热门和省份填充市区数据
      // 定义方法
      function getCity(prov) {
        var citys_array = $.grep(json.citylist, function(e) {
          return e.p == prov;
        })[0].c;
        // 填充数据
        var citys_html = "";
        for (var i=0; i<citys_array.length; i++) {
          citys_html += ("<li>" + citys_array[i].n + "</li>");
        }
        $(".slct_cnt_list_item-citys").html(citys_html);
        // 切换至市区标签
        $(".slct_cnt_list_tab-citys").trigger("click");
      }
      // 绑定方法 省份
      $(".slct_cnt_list_item-provs").on("click", "li", function() {
        // 确认省份
        var prov = $.trim($(this).text());
        // 确定参数
        para.prov = prov;
        
        getCity(prov);
      });
      // 绑定方法 热门
      $(".slct_cnt_list_item-hot").on("click", "li", function() {
        // 确认省份
        var prov = $.trim($(this).text());
        // 确定参数
        para.prov = prov;
        
        getCity(prov);
      });
      
    });
    
    // 点击市区
    $(".slct_cnt_list_item-citys").on("click", "li", function() {
      var city = $.trim($(this).text());
      para.city = city;
      $(".slct_cnt_input").val(para.prov + "-" + para.city);
      $(".slct_cnt").hide();
    });
    
    // 查询
    $(".slct_btn").click(function() {
      // 载入数据
      loadData(para);
    });
  })();
  
  // 用来载入数据的方法
  function loadData(para) {
    // 取得相关元素
    var map_pop_grey = $(".mapPop_grey");
    var map_pop = $(".mapPop"),
        mapPop_ttl = $(".mapPop_ttl h2"),
        mapPop_list = $(".mapPop_list");
    $.post("/index/City", para, function(data) {
      // 获取数据
      var list = data.result;
        // 插入城市名字
        mapPop_ttl.text(para.city);
        // 循环数据，插入该城市各个众创空间
        var html = "";
        for (var i=0; i<list.length; i++) {
          var li = '<li class="mapPop_list_items"><a href="/detail/' + list[i].id + '" target="_blank">' + list[i].name + '</a></li>'
          html +=li;
        }
        mapPop_list.html(html);
      });
      // 显示弹出层
      map_pop_grey.fadeIn();
      map_pop.fadeIn();
  }
});