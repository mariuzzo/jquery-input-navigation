/* global jQuery, console */
'use strict';

(function($) {
    var defaults = {
        cyclic: false,
        inputs: ':text',
        keybindings: {
            next: 40,
            prev: 38
        }
    };
    
    //TODO: What's the best place to put this custom function?
    //http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
    var toType = function(obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };

    // Constructor //

    /**
     * Construct a new InputNavigation object.
     *
     * @param container The container element.
     * @param options The options to use.
     */
    var InputNavigation = function(container, options) {
        this.$container = $(container);
        this.$options = $.extend({}, defaults, options);
        this.init();
    };

    // Methods //

    /**
     * Initialize everything needed before use.
     */
    InputNavigation.prototype.init = function() {
        var self = this;

        // Bind events.

        // Handle input elements navigation by keybindings.
        self.$container.on('keydown.input-navigation.navigation', self.$options.inputs, function(event) {
            console.log(event.which);
            if (event.which === self.$options.keybindings.next) {
                event.preventDefault();
                self.next();
            } else if (event.which === self.$options.keybindings.prev) {
                event.preventDefault();
                self.prev();
            }
        });

        // Track current focused input element.
        self.$container.on('focus.input-navigation.tracking', self.$options.inputs, function(event) {
            self.$current = $(event.target);
        });
    };

    /**
     * Navigate to next input field.
     */
    InputNavigation.prototype.next = function() {
        var $inputs = this.$container.find(this.$options.inputs);
        var index = $inputs.index(this.current()) + 1;
        if (this.$options.cyclic && index === $inputs.length) {
            index = 0;
        }
        $inputs.eq(index).trigger('focus').trigger('select');
    };

    /**
     * Navigate to previous input field.
     */
    InputNavigation.prototype.prev = function() {
        var $inputs = this.$container.find(this.$options.inputs);
        var index = $inputs.index(this.current()) - 1;
        if (this.$options.cyclic && index < 0) {
            index = $inputs.length - 1;
        }
        $inputs.eq(index).trigger('focus').trigger('select');
    };

    /**
     * Return the current focused element
     */
    InputNavigation.prototype.current = function() {
        return this.$current || this.$container.find(':focus');
    };

    // jQuery plugin definition //

    $.fn.inputNavigation = function(options) {
        // Store any extra arguments for later use.
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var $this = $(this);
            var instance = $this.data('inputNavigation');
            
            // Create or use existing instance.
            if (!instance || toType(instance) !== InputNavigation) {
                $this.data('inputNavigation', (instance = new InputNavigation(this, options || instance )));
            }
            // Invoke method.
            if (typeof options === 'string' && $.isFunction(instance[options])) {
                console.log(args);
                instance[options].apply(instance, args);
            }
        });
    };
    
})(jQuery);

// Automatic attachment of the plugin on every DOM element that meets the attribute criteria
jQuery(function(){
    jQuery('[data-input-navigation]').inputNavigation();
});