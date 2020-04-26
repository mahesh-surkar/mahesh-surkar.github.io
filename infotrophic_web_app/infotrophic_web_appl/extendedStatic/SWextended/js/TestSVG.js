function loadSVG()
{
	  var s = Snap("");
      var bigCircle = s.circle(100, 100, 50);
      bigCircle.attr({
          fill: "#bada55",
          stroke: "#000",
          strokeWidth: 5
      });
      var smallCircle = s.circle(70, 100, 40);
      var discs = s.group(smallCircle, s.circle(130, 100, 40));
      discs.attr({
          fill: Snap("#pattern")
      });
      bigCircle.attr({
          mask: discs
      });
      Snap.load("mascot.svg", function (f) {
          var g = f.select("g");
          f.selectAll("polygon[fill='#09B39C']").attr({
              fill: "#fc0"
          })
          s.append(g);
          g.drag();
      });
}


