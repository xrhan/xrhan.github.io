// Written by Dor Verbin, October 2021
// This is based on: http://thenewcode.com/364/Interactive-Before-and-After-Video-Comparison-in-HTML5-Canvas
// With additional modifications based on: https://jsfiddle.net/7sk5k4gp/13/

function playVids(videoId) {
    var videoMerge = document.getElementById(videoId + "Merge");
    var vid = document.getElementById(videoId);

    var position = 0.5;
    var vidWidth = vid.videoWidth / 2;
    var vidHeight = vid.videoHeight;

    var mergeContext = videoMerge.getContext("2d");

    if (vid.readyState > 3) {
        vid.play();

        function trackLocation(e) {
            // FIX: Use clientY (viewport) instead of pageY (document)
            // and bcr.top instead of bcr.y for better browser compatibility
            var bcr = videoMerge.getBoundingClientRect();
            position = ((e.clientY - bcr.top) / bcr.height);
        }

        function trackLocationTouch(e) {
            // FIX: Use clientY for touch as well
            var bcr = videoMerge.getBoundingClientRect();
            position = ((e.touches[0].clientY - bcr.top) / bcr.height);
        }

        videoMerge.addEventListener("mousemove", trackLocation, false);
        videoMerge.addEventListener("touchstart", trackLocationTouch, false);
        videoMerge.addEventListener("touchmove", trackLocationTouch, false);

        function drawLoop() {
            // 1. Draw Base (Left Video)
            mergeContext.drawImage(vid, 0, 0, vidWidth, vidHeight, 0, 0, vidWidth, vidHeight);

            // 2. Calculate Split
            var currY = (vidHeight * position).clamp(0.0, vidHeight);
            var remainingHeight = vidHeight - currY;

            // 3. Draw Overlay (Right Video)
            if (remainingHeight > 0) {
                mergeContext.drawImage(vid, 
                    vidWidth, currY, vidWidth, remainingHeight, 
                    0, currY, vidWidth, remainingHeight
                );
            }

            // --- UI DRAWING ---
            var arrowLength = 0.09 * vidHeight;
            var arrowheadWidth = 0.025 * vidHeight;
            var arrowheadLength = 0.04 * vidHeight;
            var arrowPosX = vidWidth / 2; 
            var arrowWidth = 0.007 * vidHeight;

            // Circle
            mergeContext.beginPath();
            mergeContext.arc(arrowPosX, currY, arrowLength * 0.7, 0, Math.PI * 2, false);
            mergeContext.fillStyle = "#FFD79340";
            mergeContext.fill();

            // Line
            mergeContext.beginPath();
            mergeContext.moveTo(0, currY);
            mergeContext.lineTo(vidWidth, currY);
            mergeContext.strokeStyle = "#444444";
            mergeContext.lineWidth = 5;
            mergeContext.stroke();

            // Arrow
            mergeContext.beginPath();
            mergeContext.moveTo(arrowPosX - arrowWidth / 2, currY);
            mergeContext.lineTo(arrowPosX - arrowWidth / 2, currY - arrowLength / 2 + arrowheadLength / 2);
            mergeContext.lineTo(arrowPosX - arrowheadWidth / 2, currY - arrowLength / 2 + arrowheadLength / 2);
            mergeContext.lineTo(arrowPosX, currY - arrowLength / 2);
            mergeContext.lineTo(arrowPosX + arrowheadWidth / 2, currY - arrowLength / 2 + arrowheadLength / 2);
            mergeContext.lineTo(arrowPosX + arrowWidth / 2, currY - arrowLength / 2 + arrowheadLength / 2);
            mergeContext.lineTo(arrowPosX + arrowWidth / 2, currY + arrowLength / 2 - arrowheadLength / 2);
            mergeContext.lineTo(arrowPosX + arrowheadWidth / 2, currY + arrowLength / 2 - arrowheadLength / 2);
            mergeContext.lineTo(arrowPosX, currY + arrowLength / 2);
            mergeContext.lineTo(arrowPosX - arrowheadWidth / 2, currY + arrowLength / 2 - arrowheadLength / 2);
            mergeContext.lineTo(arrowPosX - arrowWidth / 2, currY + arrowLength / 2 - arrowheadLength / 2);
            mergeContext.lineTo(arrowPosX - arrowWidth / 2, currY);
            mergeContext.closePath();
            mergeContext.fillStyle = "#444444";
            mergeContext.fill();

            requestAnimationFrame(drawLoop);
        }
        requestAnimationFrame(drawLoop);
    }
}

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

function resizeAndPlay(element)
{
  var cv = document.getElementById(element.id + "Merge");
  cv.width = element.videoWidth/2;
  cv.height = element.videoHeight;
  element.play();
  element.style.height = "0px";  // Hide video without stopping it
    
  playVids(element.id);
}