$(function advanced_titles(container){

    var
    ticks_X = [],
    i, graph, options;

    // 縦軸を表示するために、バーンダウンの配列の個数を数えてticksに入れる
    for (i = 0; i < burndown.length + 1 ; i++) {
        ticks_X.push([i]);
    }

    graph =[
        {data: burndown , label: "Burndown"},
        {data: velocity, label: "verocity", bars: { show: true, barWidth: 0.1,lineWidth: 0 }}
    ];
    
    options = {
        title: 'Burndown and velocity charts',
        HtmlText: false,
        xaxis: {
            ticks: ticks_X,
            title: "イテレーション"
        },
        yaxis: {
            min: 0,
            max: 300,
            title: "Points"
        },
        legend: {
            position: "nw"
        }           
    };

    Flotr.draw($('#graph').get(0), graph, options);
    
});