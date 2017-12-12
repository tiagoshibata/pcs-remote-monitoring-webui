// Copyright (c) Microsoft. All rights reserved.

import React from "react";
import {Modal} from "react-bootstrap";
import _ from 'lodash';
import EventTopic from "../../common/eventtopic";
import Http from "../../common/httpClient";
import "./genericDropDownList.css";

import $ from "jquery";
window.jQuery = $;
require('bootstrap');

export default class GenericDropDownList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items: [],
            selectedIds: [],
            loading: true
        };
    }

    componentDidMount() {
        this.subscriptions = [];
        if (this.props.reloadRequestTopic) {
            this.subscriptions.push(EventTopic.subscribe(this.props.reloadRequestTopic, this.onReloadRequest));
        }

        this.getItemList();
    }

    componentWillReceiveProps(nextProps) {
        const newItems = nextProps.items, currentItems = this.state.items;
        const hasChangedItem = (a, b) => {
            const pairs = _.zip(a, b);
            return pairs.some((pair) => {pair[0].ETag != pair[1].ETag});
        }

        if (newItems.length != currentItems.length || hasChangedItem(newItems, currentItems)) {
            this.setItems(nextProps.items);
        }
    }

    componentWillUnmount() {
        EventTopic.unsubscribe(this.subscriptions);
    }

    getItemList(query) {
        if (this.props.requestUrl) {
            let url = this.props.requestUrl;
            if (query) {
                url += '/' + query;
            }

            Http.get(url).then(this.setItems);

            this.setState({loading: true});
        }
    }

    setItems = items => {
        if (typeof items === 'object' && !Array.isArray(items)) {
            items = items.items;
        }
        items = items.map(this.props.requestObjectToListModel);  // Object containing 'id', 'text' and 'selected' keys

        // Get selected ids
        let selectedIds = [];
        let ids = items.map(item => item.id);

        if (this.props.initialState.selectFirstItem && ids.length > 0) {
            // select the first item
            selectedIds.push(ids[0]);
        }

        if (this.props.initialState.keepLastSelection) {
            // keep last selection
            selectedIds = selectedIds.concat(this.state.selectedIds.filter(id => ids.indexOf(id) >= 0 && selectedIds.indexOf(id) < 0));
        }

        // Apply selected flag in items
        items.forEach(item => {
            if (item.selected && selectedIds.indexOf(item.id) < 0) {
                selectedIds.push(item.id);
            }
        });

        this.setState(
            {
            items: items,
            selectedIds: selectedIds,
            loading: false
            },
            () => {EventTopic.publish(this.props.publishTopic, this.state.selectedIds, this);}
        );
    }

    onClickItem = (id) => {
        let selectedIds;

        if (this.props.multipleSelect) {
            selectedIds = this.state.selectedIds;

            let index = selectedIds.indexOf(id);

            if (index < 0) {
                selectedIds.push(id);
            } else {
                selectedIds.splice(index, 1);
            }
        } else {
            selectedIds = [id];
        }

        this.setState(
            {selectedIds: selectedIds},
            () => {EventTopic.publish(this.props.publishTopic, this.state.selectedIds, this);}
            );
    };

    onSelectAll = () => {
        let selectedIds;

        if (this.state.selectedIds.length === this.state.items.length) {
            selectedIds = [];
        } else {
            selectedIds = this.state.items.map(item => item.id);
        }

        this.setState(
            {selectedIds: selectedIds},
            () => {EventTopic.publish(this.props.publishTopic, this.state.selectedIds, this);}
            );
    };

    onNewItem = () => {
        this.setState({showModal: true});
    };

    onEditItem = () => {
        this.setState({showModal: true});
    };

    onReloadRequest = (topic, data) => {
        this.getItemList(data);
    };

    renderItem(item) {
        if (this.props.multipleSelect) {
            return (
                <li key={item.id}>
                    <a onClick={() => this.onClickItem(item.id)}>
                        <input type="checkbox" checked={this.state.selectedIds.indexOf(item.id) >= 0} onChange={() => {
                        }}/>
                        {' ' + item.text}
                        {this.props.editItem && this.renderEditItem()}
                    </a>
                </li>
            );
        } else {
            return (
                <li key={item.id}>
                    <a onClick={() => this.onClickItem(item.id)}>
                        {item.text}
                        {this.props.editItem && this.renderEditItem()}
                    </a>
                </li>
            );
        }
    }

    renderEditItem() {
        return (
            <span style={{float: 'right', cursor: 'pointer'}} onClick={this.onEditItem}>
                {this.props.editItem.text}
            </span>
        );
    }

    render() {
        return (
            <div className="dropdown">
                <button className="btn btn-default btn-block dropdown-toggle genericDropDownListWrap"
                        type="button"
                        data-toggle="dropdown"
                        disabled={this.state.loading}>
                    {this.state.items.filter(item => this.state.selectedIds.indexOf(item.id) >= 0).map(item => item.text).join(', ') || this.props.initialState.defaultText}
                    <span className="caret"/>
                </button>
                <ul className={'dropdown-menu ' + (this.props.menuAlign === 'right' ? 'dropdown-menu-right' : '')}>
                    {
                        this.props.multipleSelect && this.props.selectAll &&
                        <li key="_selectAll">
                            <a onClick={this.onSelectAll}>
                                <input type="checkbox"
                                       className="genericDropDownListItemSelectAll"
                                       checked={this.state.selectedIds.length === this.state.items.length}
                                       onChange={() => {
                                       }}/>
                                {' ' + this.props.selectAll.text}
                            </a>
                        </li>
                    }
                    {
                        this.state.items && this.state.items.map((item) => this.renderItem(item))
                    }
                    {
                        this.props.newItem &&
                        <li key="_newItem">
                            <a onClick={this.onNewItem}>
                                {this.props.newItem.text}
                            </a>
                        </li>
                    }
                </ul>
                {
                    this.props.newItem &&
                    <Modal ref='deviceGroupEditorModal' show={this.state.showModal} bsSize='large'>
                        <Modal.Body>
                            <this.props.newItem.dialog onClose={() => this.setState({showModal: false})}/>
                        </Modal.Body>
                    </Modal>
                }
            </div>
        );
    }
}
