import Attribute from "../Attribute";
import AttributeDefinitions from "../AttributeDefinitions";
import Rect from "../Rect";
import { JSMap } from "../Types";
import BorderNode from "./BorderNode";
import IDraggable from "./IDraggable";
import Model, { ILayoutMetrics } from "./Model";
import Node from "./Node";
import TabSetNode from "./TabSetNode";

class TabNode extends Node implements IDraggable {
    static readonly TYPE = "tab";

    /** @hidden @internal */
    static _fromJson(json: any, model: Model, addToModel: boolean = true) {
        const newLayoutNode = new TabNode(model, json, addToModel);
        return newLayoutNode;
    }
    /** @hidden @internal */
    private static _attributeDefinitions: AttributeDefinitions = TabNode._createAttributeDefinitions();

    /** @hidden @internal */
    private static _createAttributeDefinitions(): AttributeDefinitions {
        const attributeDefinitions = new AttributeDefinitions();
        attributeDefinitions.add("type", TabNode.TYPE, true);
        attributeDefinitions.add("component", undefined, true).setType(Attribute.STRING);
        attributeDefinitions.add("id", undefined, true).setType(Attribute.ID);
        attributeDefinitions.add("modelPayload", undefined).setType(Attribute.JSON);

        attributeDefinitions.add("name", "[Unnamed Tab]").setType(Attribute.STRING);
        attributeDefinitions.add("config", undefined).setType(Attribute.JSON);
        attributeDefinitions.add("floating", false).setType(Attribute.BOOLEAN);

        attributeDefinitions.addInherited("enableClose", "tabEnableClose").setType(Attribute.BOOLEAN);
        attributeDefinitions.addInherited("closeType", "tabCloseType").setType(Attribute.INT);
        attributeDefinitions.addInherited("enableDrag", "tabEnableDrag").setType(Attribute.BOOLEAN);
        attributeDefinitions.addInherited("enableRename", "tabEnableRename").setType(Attribute.BOOLEAN);
        attributeDefinitions.addInherited("className", "tabClassName").setType(Attribute.STRING);
        attributeDefinitions.addInherited("icon", "tabIcon").setType(Attribute.STRING);
        attributeDefinitions.addInherited("enableRenderOnDemand", "tabEnableRenderOnDemand").setType(Attribute.BOOLEAN);
        attributeDefinitions.addInherited("enableFloat", "tabEnableFloat").setType(Attribute.BOOLEAN);
        return attributeDefinitions;
    }

    /** @hidden @internal */
    private _tabRect?: Rect;
    /** @hidden @internal */
    private _renderedName?: string;
    /** @hidden @internal */
    private _extra: JSMap<any>;
    /** @hidden @internal */
    private _window?: Window;

    /** @hidden @internal */
    constructor(model: Model, json: any, addToModel: boolean = true) {
        super(model);

        this._extra = {}; // extra data added to node not saved in json

        TabNode._attributeDefinitions.fromJson(json, this._attributes);
        if (addToModel === true) {
            model._addNode(this);
        }
    }

    getWindow() {
        return this._window;
    }

    getTabRect() {
        return this._tabRect;
    }

    /** @hidden @internal */
    _setTabRect(rect: Rect) {
        this._tabRect = rect;
    }

    /** @hidden @internal */
    _setRenderedName(name: string) {
        this._renderedName = name;
    }

    /** @hidden @internal */
    _getRenderedName() {
        return this._renderedName;
    }

    getName() {
        return this._getAttr("name") as string;
    }

    /**
     * Returns the config attribute that can be used to store node specific data that
     * WILL be saved to the json. The config attribute should be changed via the action Actions.updateNodeAttributes rather
     * than directly, for example:
     * this.state.model.doAction(
     *   FlexLayout.Actions.updateNodeAttributes(node.getId(), {config:myConfigObject}));
     */
    getConfig() {
        return this._attributes.config;
    }

    /**
     * Returns an object that can be used to store transient node specific data that will
     * NOT be saved in the json.
     */
    getExtraData() {
        return this._extra;
    }

    isFloating() {
        const configFloating = this._getAttr("floating") as boolean;
        return configFloating;
    }

    getIcon() {
        return this._getAttributeAsStringOrUndefined("icon");
    }

    isEnableClose() {
        return this._getAttr("enableClose") as boolean;
    }

    getCloseType() {
        return this._getAttr("closeType") as number;
    }

    isEnableFloat() {
        const allowFloat = this._getAttr("enableFloat") as boolean;
        return allowFloat;
    }

    isEnableDrag() {
        return this._getAttr("enableDrag") as boolean;
    }

    isEnableRename() {
        return this._getAttr("enableRename") as boolean;
    }

    getClassName() {
        return this._getAttributeAsStringOrUndefined("className");
    }

    isEnableRenderOnDemand() {
        return this._getAttr("enableRenderOnDemand") as boolean;
    }

    /** @hidden @internal */
    _setName(name: string) {
        this._attributes.name = name;
        if (this._window && this._window.document) {
            this._window.document.title = name;
        }
    }

    /** @hidden @internal */
    _setFloating(float: boolean) {
        this._attributes.floating = float;
    }

    /** @hidden @internal */
    _layout(rect: Rect, metrics: ILayoutMetrics) {
        if (!rect.equals(this._rect)) {
            this._fireEvent("resize", { rect });
        }
        this._rect = rect;
    }

    /** @hidden @internal */
    _delete() {
        (this._parent as TabSetNode | BorderNode)._remove(this);
        this._fireEvent("close", {});
    }

    /** @hidden @internal */
    _toJson() {
        const json = {};
        TabNode._attributeDefinitions.toJson(json, this._attributes);
        return json;
    }

    /** @hidden @internal */
    _updateAttrs(json: any) {
        TabNode._attributeDefinitions.update(json, this._attributes);
    }

    /** @hidden @internal */
    _getAttributeDefinitions() {
        return TabNode._attributeDefinitions;
    }

    /** @hidden @internal */
    _setWindow(window: Window | undefined) {
        this._window = window;
    }
}

export default TabNode;
