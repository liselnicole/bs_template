module.exports = function() {
    var config = {
        less_bs_src: "./bower_components/less",
        less_src: "./src/styles.less",
        paths: {
            html: {
                src:  ["src/**/*.html"],
                dest: "build"
            },
            javascript: {
                src:  ["src/js/**/*.js"],
                dest: "build/js"
            },
            css: {
                src: ["src/css/**/*.css"],
                dest: "build/css"
            },
            less: {
                src: ["src/less/**/*.less", "!src/less/includes/**", "bower_components/font-awesome/less/font-awesome.less"],
                dest: "build/css"
            },
            bower: {
                dest: "build/lib"
            }
        }
    }
        
    return config; 
}