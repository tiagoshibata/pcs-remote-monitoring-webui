// Based on https://www.npmjs.com/package/@dr-kobros/react-jsoneditor
import React from "react";
import JSONEditor from "jsoneditor";
import styled from "styled-components";
import "jsoneditor/dist/jsoneditor.css";

class JsonEditor extends React.PureComponent {
  timeout = undefined;

  constructor(props) {
    super(props);
    this.state = {
      currentValue: props.value,
      dirty: false
    };
  }

  handleChange = () => {
    this.setState({
      currentValue: this.editor.get(),
      dirty: true
    });
  };

  handleFocus = () => {
    this.setState({
      controllingFocus: true
    });
  };

  handleBlur = () => {
    this.setState({
      controllingFocus: false
    });
  };

  componentDidMount() {
    const { value, options } = this.props;

    const mergedOptions = {
      ...options,
      onChange: this.handleChange
    };

    this.editor = new JSONEditor(this.div, mergedOptions);
    this.editor.set(value);
    if (this.props.expanded) {
      this.editor.expandAll();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.editor.set(nextProps.value);
    this.setState({
      currentValue: nextProps.value,
      dirty: false
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { onChange, onDirty } = this.props;

    if (this.state.dirty === true && this.state.controllingFocus) {
      onDirty();
    }

    if (this.state.dirty === true && !this.state.controllingFocus) {
      this.timeout = setTimeout(() => {
        onChange && onChange(this.state.currentValue);
        this.setState({
          dirty: false
        });
      }, 100);
    }

    if (this.state.controllingFocus) {
      clearTimeout(this.timeout);
    }

    if (prevProps.value !== this.props.value) {
      this.editor.set(this.props.value);
      this.setState({
        currentValue: this.props.value,
        dirty: false
      });
    }
  }

  componentWillUnmount() {
    this.editor.destroy();
    delete this.editor;
    clearTimeout(this.timeout);
  }

  render() {
    const { className } = this.props;

    return (
      <div
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={className}
        ref={div => {
          this.div = div;
        }}
      />
    );
  }
}

JsonEditor.defaultProps = {
  config: {},
  onDirty: () => {},
};

export default styled(JsonEditor).attrs({
  width: props => props.width || "300px",
  height: props => props.height || "300px",

})`
  width: ${props => props.width};
  height: ${props => props.height};
`;
