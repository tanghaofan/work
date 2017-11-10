onmessage = function (e) {
    var radius = 20 ; //定义模糊半径
    var quan = getQuan(radius);
    var quanSub = ArrSub(quan);
    quan = jiaQuan(quan,quanSub); //获取权值

    var canvasData = e.data.canvasDataCtrl;
    var canvasDataCtrl = e.data.canvasDataCtrl;
    var width = e.data.width,
        height = e.data.height ;
    console.log(new Date().getSeconds()) //高斯模糊开始时间
    for (var i=0;i<width ;i++ )
    {
        for (var j=0;j<height ;j++ )
        {
            var index= (width*4)*j+i*4;
            canvasDataCtrl.data[index] = getValue(i,j,0,quan); //r
            canvasDataCtrl.data[index+1] = getValue(i,j,1,quan); //g
            canvasDataCtrl.data[index+2] = getValue(i,j,2,quan); //b
            canvasDataCtrl.data[index+3] = getValue(i,j,3,quan); //a
        }
    }
    // context.putImageData(canvasDataCtrl, 0, 0);




    function gaosi(x,y,a){ //根据高斯二维公式，获取点的高斯值
        var e = Math.E ;
        var pi = Math.PI ;
        return 1/(2*pi*a*a)*Math.pow(e,-((x*x+y*y)/(2*a*a)))
    }
    //假设radius=x,那么会获得一个(2*x+1)×(2*x+1)的数组矩阵
    //数组第一个元素的坐标是【-x,x】

    function getQuan(radius){ //获取每个点的高斯值，返回数组
        var quan = []
        for (var i=-radius;i<=radius ;i++ )
        {
            for (var j=radius;j>=-radius ;j-- )
            {
                quan.push(gaosi(i,j,20));
            }
        }
        return quan ;
    }
    function ArrSub(arr){ //返回高斯数组所有元素的值的和
        var sub = 0 ;
        for (var i=0,len=quan.length;i<len ;i++ )
        {
            sub += quan[i] ;
        }
        return sub ;
    }
    function jiaQuan(arr,quanSub){ //获取权的数组
        for (var i=0,len=arr.length;i<len ;i++ )
        {
            arr[i] = arr[i]/quanSub;
        }
        return arr ;
    }
    function getValue(x,y,index,quan){ //根据坐标以及rgba[index]来算出高斯模糊的最终值
        var imgdata = getInfoArr(x,y,index)
        var value = 0 ;
        for (var i=0,len=imgdata.length;i<len ;i++ )
        {
            value += imgdata[i]*quan[i] ;
        }
        return Math.round(value) ;//返回整数
    }

    function getInfo(x,y,index){ //返回点的【rgba】值
        if (x<0)
        {
            x=-x
        }else if (x>width-1)
        {
            x=2*(width-1)-x
        }
        if (y<0)
        {
            y=-y
        }else if (y>height-1)
        {
            y=2*(height-1)-y
        }
        var i = (width*4)*y+x*4+index;
        return canvasData.data[i]
    }
    function getInfoArr(x,y,index){ //根据坐标和radius【模糊半径】，返回要和权数组相乘的数组
        var arr = [];
        for (var i=x-radius;i<=x+radius ;i++ )
        {
            for (var j=y+radius;j>=y-radius ;j-- )
            {
                arr.push(getInfo(i,j,index))
            }
        }
        return arr ;
    }

    postMessage(canvasDataCtrl);
}