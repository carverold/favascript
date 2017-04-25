module.exports.getJSCode = function() {
    return `let v_0 = 1;
if (v_0 === 2) {
    console.log(\`two\`);
}
else if (v_0 === 3) {
    console.log(\`three\`);
}
else if (v_0 === 4) {
    console.log(\`four\`);
}
else if (v_0 === 5) {
    console.log(\`five\`);
}
else {
    console.log(\`nope\`);
}`;
}
