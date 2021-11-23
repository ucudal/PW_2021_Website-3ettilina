
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* docs/ui/components/Button.svelte generated by Svelte v3.44.2 */

    const file$8 = "docs/ui/components/Button.svelte";

    function create_fragment$8(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "id", /*id*/ ctx[0]);
    			attr_dev(button, "class", /*className*/ ctx[1]);
    			attr_dev(button, "type", "button");
    			add_location(button, file$8, 5, 0, 85);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*onClick*/ ctx[2])) /*onClick*/ ctx[2].apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*id*/ 1) {
    				attr_dev(button, "id", /*id*/ ctx[0]);
    			}

    			if (!current || dirty & /*className*/ 2) {
    				attr_dev(button, "class", /*className*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { id } = $$props;
    	let { className } = $$props;
    	let { onClick } = $$props;
    	const writable_props = ['id', 'className', 'onClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    		if ('onClick' in $$props) $$invalidate(2, onClick = $$props.onClick);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ id, className, onClick });

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    		if ('onClick' in $$props) $$invalidate(2, onClick = $$props.onClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, className, onClick, $$scope, slots];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { id: 0, className: 1, onClick: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<Button> was created without expected prop 'id'");
    		}

    		if (/*className*/ ctx[1] === undefined && !('className' in props)) {
    			console.warn("<Button> was created without expected prop 'className'");
    		}

    		if (/*onClick*/ ctx[2] === undefined && !('onClick' in props)) {
    			console.warn("<Button> was created without expected prop 'onClick'");
    		}
    	}

    	get id() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* docs/ui/components/ContactForm.svelte generated by Svelte v3.44.2 */
    const file$7 = "docs/ui/components/ContactForm.svelte";

    // (19:8) <Button             id="contact__btn--close"             className="profile__button--contact"             onClick={handleClose}>
    function create_default_slot$2(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z");
    			add_location(path, file$7, 23, 16, 715);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-8 w-8 inline");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$7, 22, 12, 581);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(19:8) <Button             id=\\\"contact__btn--close\\\"             className=\\\"profile__button--contact\\\"             onClick={handleClose}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let article;
    	let div;
    	let button0;
    	let t0;
    	let form;
    	let input0;
    	let t1;
    	let input1;
    	let t2;
    	let input2;
    	let t3;
    	let input3;
    	let t4;
    	let input4;
    	let t5;
    	let button1;
    	let t6;
    	let svg;
    	let path;
    	let current;

    	button0 = new Button({
    			props: {
    				id: "contact__btn--close",
    				className: "profile__button--contact",
    				onClick: /*handleClose*/ ctx[0],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article = element("article");
    			div = element("div");
    			create_component(button0.$$.fragment);
    			t0 = space();
    			form = element("form");
    			input0 = element("input");
    			t1 = space();
    			input1 = element("input");
    			t2 = space();
    			input2 = element("input");
    			t3 = space();
    			input3 = element("input");
    			t4 = space();
    			input4 = element("input");
    			t5 = space();
    			button1 = element("button");
    			t6 = text("Submit \n                ");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(input0, "id", "contact__ipt--name");
    			input0.required = true;
    			attr_dev(input0, "class", "focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "aria-label", "Name");
    			attr_dev(input0, "placeholder", "What's your name?");
    			add_location(input0, file$7, 27, 12, 943);
    			attr_dev(input1, "id", "contact__ipt--email");
    			input1.required = true;
    			attr_dev(input1, "class", "focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10");
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "aria-label", "Email");
    			attr_dev(input1, "placeholder", "What's your email address?");
    			add_location(input1, file$7, 28, 12, 1246);
    			attr_dev(input2, "id", "contact__ipt--phone");
    			attr_dev(input2, "class", "focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10");
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "aria-label", "Phone");
    			attr_dev(input2, "placeholder", "What about your phone number?");
    			add_location(input2, file$7, 29, 12, 1561);
    			attr_dev(input3, "id", "contact__ipt--subject");
    			input3.required = true;
    			attr_dev(input3, "class", "focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10");
    			attr_dev(input3, "type", "text");
    			attr_dev(input3, "aria-label", "Subject");
    			attr_dev(input3, "placeholder", "Why are you contacting me?");
    			add_location(input3, file$7, 30, 12, 1871);
    			attr_dev(input4, "id", "contact__ipt--content");
    			input4.required = true;
    			attr_dev(input4, "class", "focus:border-light-blue-500 focus:ring-1 focus:ring-light-blue-500 focus:outline-none w-full text-sm text-black placeholder-gray-500 border border-gray-200 rounded-md py-2 pl-10");
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "aria-label", "Content");
    			attr_dev(input4, "placeholder", "You can explain more about it here :)");
    			add_location(input4, file$7, 31, 12, 2189);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M12 19l9 2-9-18-9 18 9-2zm0 0v-8");
    			add_location(path, file$7, 35, 20, 2773);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6 inline");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$7, 34, 16, 2635);
    			attr_dev(button1, "id", "contact__btn--submit");
    			attr_dev(button1, "class", "profile__button--contact");
    			attr_dev(button1, "type", "button");
    			add_location(button1, file$7, 33, 12, 2530);
    			attr_dev(form, "class", "space-y-2");
    			add_location(form, file$7, 26, 8, 906);
    			attr_dev(div, "class", "contact__modal--content");
    			add_location(div, file$7, 17, 4, 394);
    			attr_dev(article, "id", "contact__modal--container");
    			attr_dev(article, "class", /*modalClasses*/ ctx[1]);
    			add_location(article, file$7, 16, 0, 328);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div);
    			mount_component(button0, div, null);
    			append_dev(div, t0);
    			append_dev(div, form);
    			append_dev(form, input0);
    			append_dev(form, t1);
    			append_dev(form, input1);
    			append_dev(form, t2);
    			append_dev(form, input2);
    			append_dev(form, t3);
    			append_dev(form, input3);
    			append_dev(form, t4);
    			append_dev(form, input4);
    			append_dev(form, t5);
    			append_dev(form, button1);
    			append_dev(button1, t6);
    			append_dev(button1, svg);
    			append_dev(svg, path);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const button0_changes = {};
    			if (dirty & /*handleClose*/ 1) button0_changes.onClick = /*handleClose*/ ctx[0];

    			if (dirty & /*$$scope*/ 8) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (!current || dirty & /*modalClasses*/ 2) {
    				attr_dev(article, "class", /*modalClasses*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_component(button0);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContactForm', slots, []);
    	let { show } = $$props;
    	let { handleClose } = $$props;
    	let modalClasses;
    	const writable_props = ['show', 'handleClose'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContactForm> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(2, show = $$props.show);
    		if ('handleClose' in $$props) $$invalidate(0, handleClose = $$props.handleClose);
    	};

    	$$self.$capture_state = () => ({ Button, show, handleClose, modalClasses });

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(2, show = $$props.show);
    		if ('handleClose' in $$props) $$invalidate(0, handleClose = $$props.handleClose);
    		if ('modalClasses' in $$props) $$invalidate(1, modalClasses = $$props.modalClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*show*/ 4) {
    			{
    				if (show) {
    					$$invalidate(1, modalClasses = "contact__modal");
    				} else {
    					$$invalidate(1, modalClasses = "contact__modal contact__modal--hidden");
    				}
    			}
    		}
    	};

    	return [handleClose, modalClasses, show];
    }

    class ContactForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { show: 2, handleClose: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContactForm",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*show*/ ctx[2] === undefined && !('show' in props)) {
    			console.warn("<ContactForm> was created without expected prop 'show'");
    		}

    		if (/*handleClose*/ ctx[0] === undefined && !('handleClose' in props)) {
    			console.warn("<ContactForm> was created without expected prop 'handleClose'");
    		}
    	}

    	get show() {
    		throw new Error("<ContactForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<ContactForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleClose() {
    		throw new Error("<ContactForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set handleClose(value) {
    		throw new Error("<ContactForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* docs/ui/components/Container.svelte generated by Svelte v3.44.2 */

    const file$6 = "docs/ui/components/Container.svelte";

    function create_fragment$6(ctx) {
    	let section;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (default_slot) default_slot.c();
    			attr_dev(section, "class", "grid grid-cols-4 gap-4 pt-10 pl-5 pr-5 pb-10 h-screen");
    			add_location(section, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			if (default_slot) {
    				default_slot.m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Container', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Container> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    let jobExperienceDetails =
        {
            date: String,
            current: Boolean,
            title: String,
            place: {
                name: String,
                webpage: String
            },
            description: [String]
        };

    let studyExperienceDetails =
        {
            date: String,
            completed: Boolean,
            title: String,
            place: {
                name: String,
                webpage: String,
                certificate: String
            },
            description: [String]
        };

    let jobDetails = writable([jobExperienceDetails]);
    let studyDetails = writable([studyExperienceDetails]);

    const baseUrl = "https://ProgWebAPINode.bettilina.repl.co";

    function getExperienceDetails() {
        fetch(`${baseUrl}/experience`)
        .then(response => response.json()
            .then(data => {
                console.log(data);
                jobDetails.set(data.job);
                studyDetails.set(data.study);
            }))
        .catch(error => {
            console.log(error);
            return []
        });
    }

    /* docs/ui/components/ExperienceContainer.svelte generated by Svelte v3.44.2 */

    const file$5 = "docs/ui/components/ExperienceContainer.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (18:4) {#each details.description as desc}
    function create_each_block$2(ctx) {
    	let p;
    	let t_value = /*desc*/ ctx[3] + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "text-s font-light");
    			add_location(p, file$5, 18, 4, 689);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*details*/ 1 && t_value !== (t_value = /*desc*/ ctx[3] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(18:4) {#each details.description as desc}",
    		ctx
    	});

    	return block;
    }

    // (21:4) {#if details.place.certificate}
    function create_if_block$2(ctx) {
    	let p;
    	let a;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			a = element("a");
    			t = text("View certification");
    			attr_dev(a, "href", a_href_value = /*details*/ ctx[0].place.certificate);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$5, 21, 43, 820);
    			attr_dev(p, "class", "text-s italic text-blue-600");
    			add_location(p, file$5, 21, 4, 781);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*details*/ 1 && a_href_value !== (a_href_value = /*details*/ ctx[0].place.certificate)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(21:4) {#if details.place.certificate}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let article;
    	let p;
    	let t0_value = /*details*/ ctx[0].date + "";
    	let t0;
    	let t1;
    	let h2;
    	let t2_value = /*details*/ ctx[0].title + "";
    	let t2;
    	let t3;
    	let h3;
    	let a;
    	let t4_value = /*details*/ ctx[0].place.name + "";
    	let t4;
    	let a_href_value;
    	let t5;
    	let t6;
    	let each_value = /*details*/ ctx[0].description;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	let if_block = /*details*/ ctx[0].place.certificate && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(t2_value);
    			t3 = space();
    			h3 = element("h3");
    			a = element("a");
    			t4 = text(t4_value);
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			if (if_block) if_block.c();
    			attr_dev(p, "class", "text-s font-light italic");
    			add_location(p, file$5, 14, 4, 435);
    			attr_dev(h2, "class", "text-m font-semibold");
    			add_location(h2, file$5, 15, 4, 494);
    			attr_dev(a, "href", a_href_value = /*details*/ ctx[0].place.webpage);
    			add_location(a, file$5, 16, 35, 583);
    			attr_dev(h3, "class", "text-blue-500 mb-2");
    			add_location(h3, file$5, 16, 4, 552);
    			attr_dev(article, "class", /*style*/ ctx[1]);
    			add_location(article, file$5, 13, 0, 407);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, p);
    			append_dev(p, t0);
    			append_dev(article, t1);
    			append_dev(article, h2);
    			append_dev(h2, t2);
    			append_dev(article, t3);
    			append_dev(article, h3);
    			append_dev(h3, a);
    			append_dev(a, t4);
    			append_dev(article, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(article, null);
    			}

    			append_dev(article, t6);
    			if (if_block) if_block.m(article, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*details*/ 1 && t0_value !== (t0_value = /*details*/ ctx[0].date + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*details*/ 1 && t2_value !== (t2_value = /*details*/ ctx[0].title + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*details*/ 1 && t4_value !== (t4_value = /*details*/ ctx[0].place.name + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*details*/ 1 && a_href_value !== (a_href_value = /*details*/ ctx[0].place.webpage)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*details*/ 1) {
    				each_value = /*details*/ ctx[0].description;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(article, t6);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*details*/ ctx[0].place.certificate) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(article, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*style*/ 2) {
    				attr_dev(article, "class", /*style*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ExperienceContainer', slots, []);
    	let { details } = $$props;
    	let { type } = $$props;
    	let style;
    	const writable_props = ['details', 'type'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ExperienceContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('details' in $$props) $$invalidate(0, details = $$props.details);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    	};

    	$$self.$capture_state = () => ({ details, type, style });

    	$$self.$inject_state = $$props => {
    		if ('details' in $$props) $$invalidate(0, details = $$props.details);
    		if ('type' in $$props) $$invalidate(2, type = $$props.type);
    		if ('style' in $$props) $$invalidate(1, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*type, details*/ 5) {
    			{
    				if (type == 'job') {
    					$$invalidate(1, style = details.current
    					? 'mb-5 p-4 rounded-md shadow-xl bg-green-50'
    					: 'mb-5 p-4 rounded-md shadow-xl bg-indigo-50');
    				} else {
    					$$invalidate(1, style = details.completed
    					? 'mb-5 p-4 rounded-md shadow-xl bg-green-50'
    					: 'mb-5 p-4 rounded-md shadow-xl bg-pink-50');
    				}
    			}
    		}
    	};

    	return [details, style, type];
    }

    class ExperienceContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { details: 0, type: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ExperienceContainer",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*details*/ ctx[0] === undefined && !('details' in props)) {
    			console.warn("<ExperienceContainer> was created without expected prop 'details'");
    		}

    		if (/*type*/ ctx[2] === undefined && !('type' in props)) {
    			console.warn("<ExperienceContainer> was created without expected prop 'type'");
    		}
    	}

    	get details() {
    		throw new Error("<ExperienceContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set details(value) {
    		throw new Error("<ExperienceContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<ExperienceContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<ExperienceContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* docs/ui/sections/Experience.svelte generated by Svelte v3.44.2 */

    const { console: console_1 } = globals;
    const file$4 = "docs/ui/sections/Experience.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (15:0) {#if jobDetails}
    function create_if_block$1(ctx) {
    	let section;
    	let article0;
    	let h10;
    	let t1;
    	let div0;
    	let t2;
    	let article1;
    	let h11;
    	let t4;
    	let div1;
    	let current;
    	let each_value_1 = /*$jobDetails*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*$studyDetails*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			article0 = element("article");
    			h10 = element("h1");
    			h10.textContent = "PROFESSIONAL EXPERIENCE 👩🏻‍💻";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			article1 = element("article");
    			h11 = element("h1");
    			h11.textContent = "EDUCATION 👩🏻‍🎓";
    			t4 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h10, "class", "text-xl mb-6 font-semibold");
    			add_location(h10, file$4, 17, 8, 601);
    			add_location(div0, file$4, 18, 8, 685);
    			attr_dev(article0, "class", "col-span-1 p-5");
    			add_location(article0, file$4, 16, 4, 560);
    			attr_dev(h11, "class", "text-xl mb-6 font-semibold");
    			add_location(h11, file$4, 25, 8, 890);
    			add_location(div1, file$4, 26, 8, 960);
    			attr_dev(article1, "class", "col-span-1 p-5");
    			add_location(article1, file$4, 24, 4, 849);
    			attr_dev(section, "class", "col-span-2 grid grid-cols-2 gap-2 bg-white shadow-2xl pt-10");
    			add_location(section, file$4, 15, 0, 478);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, article0);
    			append_dev(article0, h10);
    			append_dev(article0, t1);
    			append_dev(article0, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(section, t2);
    			append_dev(section, article1);
    			append_dev(article1, h11);
    			append_dev(article1, t4);
    			append_dev(article1, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$jobDetails*/ 1) {
    				each_value_1 = /*$jobDetails*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*$studyDetails*/ 2) {
    				each_value = /*$studyDetails*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(15:0) {#if jobDetails}",
    		ctx
    	});

    	return block;
    }

    // (20:12) {#each $jobDetails as job}
    function create_each_block_1(ctx) {
    	let experiencecontainer;
    	let current;

    	experiencecontainer = new ExperienceContainer({
    			props: { details: /*job*/ ctx[5], type: "job" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(experiencecontainer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(experiencecontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const experiencecontainer_changes = {};
    			if (dirty & /*$jobDetails*/ 1) experiencecontainer_changes.details = /*job*/ ctx[5];
    			experiencecontainer.$set(experiencecontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(experiencecontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(experiencecontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(experiencecontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(20:12) {#each $jobDetails as job}",
    		ctx
    	});

    	return block;
    }

    // (28:12) {#each $studyDetails as study}
    function create_each_block$1(ctx) {
    	let experiencecontainer;
    	let current;

    	experiencecontainer = new ExperienceContainer({
    			props: { details: /*study*/ ctx[2], type: "study" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(experiencecontainer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(experiencecontainer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const experiencecontainer_changes = {};
    			if (dirty & /*$studyDetails*/ 2) experiencecontainer_changes.details = /*study*/ ctx[2];
    			experiencecontainer.$set(experiencecontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(experiencecontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(experiencecontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(experiencecontainer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(28:12) {#each $studyDetails as study}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = jobDetails && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (jobDetails) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $jobDetails;
    	let $studyDetails;
    	validate_store(jobDetails, 'jobDetails');
    	component_subscribe($$self, jobDetails, $$value => $$invalidate(0, $jobDetails = $$value));
    	validate_store(studyDetails, 'studyDetails');
    	component_subscribe($$self, studyDetails, $$value => $$invalidate(1, $studyDetails = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Experience', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Experience> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		getExperienceDetails,
    		ExperienceContainer,
    		jobDetails,
    		studyDetails,
    		onMount,
    		$jobDetails,
    		$studyDetails
    	});

    	{
    		onMount(async () => {
    			console.log("Fetching experience");
    			getExperienceDetails();
    		});
    	}

    	return [$jobDetails, $studyDetails];
    }

    class Experience extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Experience",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    let profile = {
        picUrl: "",
        name: "",
        position: "",
        label: "",
        social: {
          linkedIn: "",
          email: ""
        },
        description: ""
      };

    const profileData = writable(profile);

    function getProfileDetails() {
        fetch(`${baseUrl}/profile-details`)
        .then(response => response.json()
            .then(data => {
                profileData.set(data);
            }))
        .catch(error => {
            console.log(error);
            return []
        });
    }

    /* docs/ui/sections/Profile.svelte generated by Svelte v3.44.2 */
    const file$3 = "docs/ui/sections/Profile.svelte";

    // (16:0) {#if ($profileData.name)}
    function create_if_block(ctx) {
    	let section;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let h1;
    	let t1_value = /*$profileData*/ ctx[1].name + "";
    	let t1;
    	let t2;
    	let p0;
    	let t3_value = /*$profileData*/ ctx[1].position + "";
    	let t3;
    	let t4;
    	let p1;
    	let t5_value = /*$profileData*/ ctx[1].label + "";
    	let t5;
    	let t6;
    	let div2;
    	let button;
    	let t7;
    	let div1;
    	let p2;
    	let t8;
    	let a0;
    	let t9;
    	let a0_href_value;
    	let t10;
    	let p3;
    	let t11;
    	let a1;
    	let t12;
    	let a1_href_value;
    	let t13;
    	let div3;
    	let p4;
    	let t14_value = /*$profileData*/ ctx[1].description + "";
    	let t14;
    	let current;

    	button = new Button({
    			props: {
    				id: "contact__btn--open",
    				className: "profile__button--contact",
    				onClick: /*onContactClick*/ ctx[0],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			h1 = element("h1");
    			t1 = text(t1_value);
    			t2 = space();
    			p0 = element("p");
    			t3 = text(t3_value);
    			t4 = space();
    			p1 = element("p");
    			t5 = text(t5_value);
    			t6 = space();
    			div2 = element("div");
    			create_component(button.$$.fragment);
    			t7 = space();
    			div1 = element("div");
    			p2 = element("p");
    			t8 = text("LinkedIn: ");
    			a0 = element("a");
    			t9 = text("bettina-carrizo");
    			t10 = space();
    			p3 = element("p");
    			t11 = text("Email: ");
    			a1 = element("a");
    			t12 = text("betticarrizo@gmail.com");
    			t13 = space();
    			div3 = element("div");
    			p4 = element("p");
    			t14 = text(t14_value);
    			attr_dev(img, "class", "w-56 h-56 rounded-full ml-auto mr-auto shadow-xl");
    			if (!src_url_equal(img.src, img_src_value = /*$profileData*/ ctx[1].picUrl)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Profile");
    			add_location(img, file$3, 18, 8, 434);
    			attr_dev(h1, "class", "profile__title mt-5");
    			add_location(h1, file$3, 19, 8, 547);
    			attr_dev(p0, "class", "profile__subtitle--strong text-center");
    			add_location(p0, file$3, 20, 8, 612);
    			attr_dev(p1, "class", "profile__subtitle--light text-center");
    			add_location(p1, file$3, 21, 8, 697);
    			attr_dev(div0, "class", "pt-3 pb-3");
    			add_location(div0, file$3, 17, 4, 402);
    			attr_dev(a0, "class", "link");
    			attr_dev(a0, "href", a0_href_value = /*$profileData*/ ctx[1].social.linkedIn);
    			add_location(a0, file$3, 31, 59, 1427);
    			attr_dev(p2, "class", "profile__subtitle--strong");
    			add_location(p2, file$3, 31, 12, 1380);
    			attr_dev(a1, "class", "link");
    			attr_dev(a1, "href", a1_href_value = "mailto:" + /*$profileData*/ ctx[1].social.email);
    			add_location(a1, file$3, 32, 56, 1561);
    			attr_dev(p3, "class", "profile__subtitle--strong");
    			add_location(p3, file$3, 32, 12, 1517);
    			add_location(div1, file$3, 30, 8, 1362);
    			attr_dev(div2, "class", "pt-3 pb-6");
    			add_location(div2, file$3, 23, 4, 785);
    			attr_dev(p4, "class", "profile__body");
    			add_location(p4, file$3, 36, 8, 1712);
    			attr_dev(div3, "class", "pt-3 pb-3");
    			add_location(div3, file$3, 35, 4, 1680);
    			attr_dev(section, "class", "container container__profile");
    			add_location(section, file$3, 16, 0, 351);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, h1);
    			append_dev(h1, t1);
    			append_dev(div0, t2);
    			append_dev(div0, p0);
    			append_dev(p0, t3);
    			append_dev(div0, t4);
    			append_dev(div0, p1);
    			append_dev(p1, t5);
    			append_dev(section, t6);
    			append_dev(section, div2);
    			mount_component(button, div2, null);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div1, p2);
    			append_dev(p2, t8);
    			append_dev(p2, a0);
    			append_dev(a0, t9);
    			append_dev(div1, t10);
    			append_dev(div1, p3);
    			append_dev(p3, t11);
    			append_dev(p3, a1);
    			append_dev(a1, t12);
    			append_dev(section, t13);
    			append_dev(section, div3);
    			append_dev(div3, p4);
    			append_dev(p4, t14);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*$profileData*/ 2 && !src_url_equal(img.src, img_src_value = /*$profileData*/ ctx[1].picUrl)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if ((!current || dirty & /*$profileData*/ 2) && t1_value !== (t1_value = /*$profileData*/ ctx[1].name + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*$profileData*/ 2) && t3_value !== (t3_value = /*$profileData*/ ctx[1].position + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*$profileData*/ 2) && t5_value !== (t5_value = /*$profileData*/ ctx[1].label + "")) set_data_dev(t5, t5_value);
    			const button_changes = {};
    			if (dirty & /*onContactClick*/ 1) button_changes.onClick = /*onContactClick*/ ctx[0];

    			if (dirty & /*$$scope*/ 4) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			if (!current || dirty & /*$profileData*/ 2 && a0_href_value !== (a0_href_value = /*$profileData*/ ctx[1].social.linkedIn)) {
    				attr_dev(a0, "href", a0_href_value);
    			}

    			if (!current || dirty & /*$profileData*/ 2 && a1_href_value !== (a1_href_value = "mailto:" + /*$profileData*/ ctx[1].social.email)) {
    				attr_dev(a1, "href", a1_href_value);
    			}

    			if ((!current || dirty & /*$profileData*/ 2) && t14_value !== (t14_value = /*$profileData*/ ctx[1].description + "")) set_data_dev(t14, t14_value);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(16:0) {#if ($profileData.name)}",
    		ctx
    	});

    	return block;
    }

    // (25:8) <Button id="contact__btn--open" className="profile__button--contact" onClick={onContactClick}>
    function create_default_slot$1(ctx) {
    	let t;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			t = text("Contact me \n            ");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z");
    			add_location(path, file$3, 27, 16, 1082);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6 inline");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$3, 26, 12, 948);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(25:8) <Button id=\\\"contact__btn--open\\\" className=\\\"profile__button--contact\\\" onClick={onContactClick}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$profileData*/ ctx[1].name && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$profileData*/ ctx[1].name) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$profileData*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $profileData;
    	validate_store(profileData, 'profileData');
    	component_subscribe($$self, profileData, $$value => $$invalidate(1, $profileData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Profile', slots, []);
    	let { onContactClick } = $$props;
    	const writable_props = ['onContactClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('onContactClick' in $$props) $$invalidate(0, onContactClick = $$props.onContactClick);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		getProfileDetails,
    		profileData,
    		Button,
    		onContactClick,
    		$profileData
    	});

    	$$self.$inject_state = $$props => {
    		if ('onContactClick' in $$props) $$invalidate(0, onContactClick = $$props.onContactClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	{
    		onMount(async () => {
    			getProfileDetails();
    		});
    	}

    	return [onContactClick, $profileData];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { onContactClick: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*onContactClick*/ ctx[0] === undefined && !('onContactClick' in props)) {
    			console.warn("<Profile> was created without expected prop 'onContactClick'");
    		}
    	}

    	get onContactClick() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onContactClick(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let skills = {
        expertise: {
            title: String,
            list: [String]
        },
        main: {
            title: String,
            list: [String]
        }
    };

    const skillsData = writable(skills);

    function getSkillsDetails() {
        fetch(`${baseUrl}/skills`)
        .then(response => response.json()
            .then(data => {
                skillsData.set(data);
            }))
        .catch(error => {
            console.log(error);
            return []
        });
    }

    /* docs/ui/components/SkillsList.svelte generated by Svelte v3.44.2 */

    const file$2 = "docs/ui/components/SkillsList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (15:8) {#each skill.list as skillName}
    function create_each_block(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let t2_value = /*skillName*/ ctx[3] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*skillIcon*/ ctx[1]);
    			t1 = space();
    			t2 = text(t2_value);
    			add_location(p, file$2, 15, 12, 347);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*skillIcon*/ 2) set_data_dev(t0, /*skillIcon*/ ctx[1]);
    			if (dirty & /*skill*/ 1 && t2_value !== (t2_value = /*skillName*/ ctx[3] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(15:8) {#each skill.list as skillName}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let article;
    	let h1;
    	let t0_value = /*skill*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let div;
    	let each_value = /*skill*/ ctx[0].list;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			article = element("article");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "text-xl font-semibold mb-5");
    			add_location(h1, file$2, 12, 4, 193);
    			attr_dev(div, "class", "mb-5 pl-7 pr-7 grid gap-2");
    			add_location(div, file$2, 13, 4, 255);
    			attr_dev(article, "class", "pt-10 pb-5");
    			add_location(article, file$2, 11, 0, 160);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, h1);
    			append_dev(h1, t0);
    			append_dev(article, t1);
    			append_dev(article, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*skill*/ 1 && t0_value !== (t0_value = /*skill*/ ctx[0].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*skill, skillIcon*/ 3) {
    				each_value = /*skill*/ ctx[0].list;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SkillsList', slots, []);
    	let { skill } = $$props;
    	let { skillType } = $$props;
    	let skillIcon;
    	const writable_props = ['skill', 'skillType'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SkillsList> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('skill' in $$props) $$invalidate(0, skill = $$props.skill);
    		if ('skillType' in $$props) $$invalidate(2, skillType = $$props.skillType);
    	};

    	$$self.$capture_state = () => ({ skill, skillType, skillIcon });

    	$$self.$inject_state = $$props => {
    		if ('skill' in $$props) $$invalidate(0, skill = $$props.skill);
    		if ('skillType' in $$props) $$invalidate(2, skillType = $$props.skillType);
    		if ('skillIcon' in $$props) $$invalidate(1, skillIcon = $$props.skillIcon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*skillType*/ 4) {
    			{
    				$$invalidate(1, skillIcon = skillType == 'expertise' ? '⭐️' : '✅');
    			}
    		}
    	};

    	return [skill, skillIcon, skillType];
    }

    class SkillsList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { skill: 0, skillType: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SkillsList",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*skill*/ ctx[0] === undefined && !('skill' in props)) {
    			console.warn("<SkillsList> was created without expected prop 'skill'");
    		}

    		if (/*skillType*/ ctx[2] === undefined && !('skillType' in props)) {
    			console.warn("<SkillsList> was created without expected prop 'skillType'");
    		}
    	}

    	get skill() {
    		throw new Error("<SkillsList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skill(value) {
    		throw new Error("<SkillsList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get skillType() {
    		throw new Error("<SkillsList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set skillType(value) {
    		throw new Error("<SkillsList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* docs/ui/sections/Skills.svelte generated by Svelte v3.44.2 */
    const file$1 = "docs/ui/sections/Skills.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let skillslist0;
    	let t;
    	let skillslist1;
    	let current;

    	skillslist0 = new SkillsList({
    			props: {
    				skill: /*$skillsData*/ ctx[0].expertise,
    				skillType: "expertise"
    			},
    			$$inline: true
    		});

    	skillslist1 = new SkillsList({
    			props: {
    				skill: /*$skillsData*/ ctx[0].main,
    				skillType: "main"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(skillslist0.$$.fragment);
    			t = space();
    			create_component(skillslist1.$$.fragment);
    			attr_dev(section, "class", "col-span-1 bg-pink-800 text-white divide-y-2 divide-white divide-dashed divide-opacity-60 container");
    			add_location(section, file$1, 13, 0, 362);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(skillslist0, section, null);
    			append_dev(section, t);
    			mount_component(skillslist1, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const skillslist0_changes = {};
    			if (dirty & /*$skillsData*/ 1) skillslist0_changes.skill = /*$skillsData*/ ctx[0].expertise;
    			skillslist0.$set(skillslist0_changes);
    			const skillslist1_changes = {};
    			if (dirty & /*$skillsData*/ 1) skillslist1_changes.skill = /*$skillsData*/ ctx[0].main;
    			skillslist1.$set(skillslist1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skillslist0.$$.fragment, local);
    			transition_in(skillslist1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skillslist0.$$.fragment, local);
    			transition_out(skillslist1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(skillslist0);
    			destroy_component(skillslist1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $skillsData;
    	validate_store(skillsData, 'skillsData');
    	component_subscribe($$self, skillsData, $$value => $$invalidate(0, $skillsData = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skills', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		getSkillsDetails,
    		skillsData,
    		SkillsList,
    		$skillsData
    	});

    	{
    		onMount(async () => {
    			getSkillsDetails();
    		});
    	}

    	return [$skillsData];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.2 */
    const file = "src/App.svelte";

    // (19:4) <Container>
    function create_default_slot(ctx) {
    	let profile;
    	let t0;
    	let experience;
    	let t1;
    	let skills;
    	let current;

    	profile = new Profile({
    			props: { onContactClick: /*func*/ ctx[3] },
    			$$inline: true
    		});

    	experience = new Experience({ $$inline: true });
    	skills = new Skills({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(profile.$$.fragment);
    			t0 = space();
    			create_component(experience.$$.fragment);
    			t1 = space();
    			create_component(skills.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(profile, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(experience, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(skills, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(profile.$$.fragment, local);
    			transition_in(experience.$$.fragment, local);
    			transition_in(skills.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(profile.$$.fragment, local);
    			transition_out(experience.$$.fragment, local);
    			transition_out(skills.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(profile, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(experience, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(skills, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(19:4) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let container;
    	let t;
    	let contactform;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	contactform = new ContactForm({
    			props: {
    				show: /*showContactModal*/ ctx[0],
    				handleClose: /*func_1*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(container.$$.fragment);
    			t = space();
    			create_component(contactform.$$.fragment);
    			attr_dev(main, "class", "antialiased bg-gray-200");
    			add_location(main, file, 17, 0, 527);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(container, main, null);
    			append_dev(main, t);
    			mount_component(contactform, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    			const contactform_changes = {};
    			if (dirty & /*showContactModal*/ 1) contactform_changes.show = /*showContactModal*/ ctx[0];
    			contactform.$set(contactform_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			transition_in(contactform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			transition_out(contactform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(container);
    			destroy_component(contactform);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let showContactModal = false;

    	function showModal() {
    		$$invalidate(0, showContactModal = true);
    	}

    	function closeModal() {
    		$$invalidate(0, showContactModal = false);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const func = () => showModal();
    	const func_1 = () => closeModal();

    	$$self.$capture_state = () => ({
    		ContactForm,
    		Container,
    		Experience,
    		Profile,
    		Skills,
    		showContactModal,
    		showModal,
    		closeModal
    	});

    	$$self.$inject_state = $$props => {
    		if ('showContactModal' in $$props) $$invalidate(0, showContactModal = $$props.showContactModal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showContactModal, showModal, closeModal, func, func_1];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
