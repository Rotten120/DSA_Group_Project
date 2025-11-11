const queueOutput = document.getElementById("output");
const observer = new ResizeObserver(() => {
    const hasOverflow = queueOutput.scrollWidth > queueOutput.clientWidth;
    queueOutput.style.justifyContent = hasOverflow ? "flex-start" : "center";
});

observer.observe(queueOutput);
