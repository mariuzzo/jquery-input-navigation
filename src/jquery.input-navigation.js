/* global jQuery, console, document */
'use strict';

(function ($) {
    var defaults = {
        cyclic: false,
        inputs: ':text',
        multipleDimensions: false,
        keybindings: {
            linear: {
                next: 40,
                prev: 38
            },
            matrix: {
                left: 37,
                up: 38,
                right: 39,
                down: 40
            }
        }
    };

    // Constructor //
    /**
     * Construct a new InputNavigation object.
     *
     * @param container The container element.
     * @param options The options to use.
     */
    var InputNavigation = function (container, options) {
        this.$container = $(container);
        this.$options = $.extend({}, defaults, options);
        this.init();
    };

    // Methods //

    /**
     * Initialize everything needed before use.
     */
    InputNavigation.prototype.init = function () {
        var self = this;

        // Bind events.

        // Handle input elements navigation by keybindings.
        self.$container.on('keydown.input-navigation.navigation', self.$options.inputs, function (event) {
            console.log(event.which);

            //Improved handling of events. Iterating over elements instead of bunch of IFs
            var bindings = self.$options.multipleDimensions ? self.$options.keybindings.matrix : self.$options.keybindings.linear;
            for (var key in bindings) {
                if (bindings.hasOwnProperty(key) && bindings[key] === event.which) {
                    console.log(key);
                    self[key].call(self);
                    break;
                }
            }

        });

        // Track current focused input element.
        self.$container.on('focus.input-navigation.tracking', self.$options.inputs, function (event) {
            self.$current = $(event.target);
        });
    };

    /**
     * Navigate to next input field.
     */
    InputNavigation.prototype.next = function () {
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
    InputNavigation.prototype.prev = function () {
        var $inputs = this.$container.find(this.$options.inputs);
        var index = $inputs.index(this.current()) - 1;
        if (this.$options.cyclic && index < 0) {
            index = $inputs.length - 1;
        }
        $inputs.eq(index).trigger('focus').trigger('select');
    };

    /**
     * Multi-dimensional input field navigation
     */
    InputNavigation.prototype.up = function () {
        var $inputs = this.$container.find(this.$options.inputs);
        var y = this.current().data('input-pos-y');
        var x = this.current().data('input-pos-x');

        var nextInput;
        if (y !== undefined) {
            if (y - 1 < 0) {
                nextInput = $inputs.filter('[data-input-pos-x=' + x + ']').sort().last();
            } else {
                //TODO: Rubens, I have a small format function (like c# does it) to do this more readably 
                //instead of concatenating multiple strings. Do you think we can use it here?
                nextInput = $inputs.filter('[data-input-pos-x=' + x + ']' + '[data-input-pos-y=' + (y - 1) + ']');
            }
            nextInput.trigger('focus').trigger('select');
        }
    };

    InputNavigation.prototype.down = function () {
        var $inputs = this.$container.find(this.$options.inputs);
        var y = this.current().data('input-pos-y');
        var x = this.current().data('input-pos-x');

        var nextInput;
        if (y !== undefined) {
            var inputsInColumn = $inputs.filter('[data-input-pos-x=' + x + ']');
            if (y + 1 >= inputsInColumn.length) {
                nextInput = $inputs.filter('[data-input-pos-x=' + x + ']').sort().first();
            } else {
                nextInput = $inputs.filter('[data-input-pos-x=' + x + ']' + '[data-input-pos-y=' + (y + 1) + ']');
            }

            nextInput.trigger('focus').trigger('select');
        }
    };

    InputNavigation.prototype.left = function () {
        var $inputs = this.$container.find(this.$options.inputs);
        var y = this.current().data('input-pos-y');
        var x = this.current().data('input-pos-x');

        var nextInput;
        if (x !== undefined) {
            if (x - 1 < 0) {
                nextInput = $inputs.filter('[data-input-pos-y=' + y + ']').sort().last();
            } else {
                nextInput = $inputs.filter('[data-input-pos-y=' + y + ']' + '[data-input-pos-x=' + (x - 1) + ']');
            }
            nextInput.trigger('focus').trigger('select');
        }
    };

    InputNavigation.prototype.right = function () {
        var $inputs = this.$container.find(this.$options.inputs);
        var y = this.current().data('input-pos-y');
        var x = this.current().data('input-pos-x');

        var nextInput;
        if (x !== undefined) {
            var inputsInRow = $inputs.filter('[data-input-pos-y=' + y + ']');
            if (x + 1 >= inputsInRow.length) {
                nextInput = $inputs.filter('[data-input-pos-y=' + y + ']').sort().first();
            } else {
                nextInput = $inputs.filter('[data-input-pos-y=' + y + ']' + '[data-input-pos-x=' + (x + 1) + ']');
            }

            nextInput.trigger('focus').trigger('select');
        }
    };

    /**
     * Return the current focused element
     */
    InputNavigation.prototype.current = function () {
        return this.$current || this.$container.find(':focus');
    };

    // jQuery plugin definition //

    $.fn.inputNavigation = function (options) {
        // Store any extra arguments for later use.
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this);
            var instance = $this.data('inputNavigation');

            // Create or use existing instance.
            if (!instance || !(instance instanceof InputNavigation)) {
                $this.data('inputNavigation', (instance = new InputNavigation(this, options || instance)));
            }
            // Invoke method.
            if (typeof options === 'string' && $.isFunction(instance[options])) {
                console.log(args);
                instance[options].apply(instance, args);
            }
        });
    };

    $(document).on('ready.input-navigation.data-api', function () {
        $('[data-input-navigation]').inputNavigation();
    });

})(jQuery);