import React from "react";
import "antd/dist/antd.css";
import {
  Form,
  Alert,
  Spin,
  Icon,
  Input,
  Button,
  Select,
  Row,
  Col,
  Modal
} from "antd";
import CustomForm from "./CustomForm";

export default class PPList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalTitle: null,
      data: this.props.parent.listsConfig[this.props.id].data,
      curData: null
    };

    // editForm
    this.editForm = null;
    const editFormConfig = this.props.parent.listsConfig[this.props.id]
      .editFormConfig;
    this.formConfig = editFormConfig.formConfig;
    this.fieldsConfig = editFormConfig.fieldsConfig;
  }

  renderHeaderField(field) {
    let key = field.id;
    if (key === 0) {
      key = new Date().getTime();
    }
    return (
      <Col key={key} {...field.props}>
        {field.label}
      </Col>
    );
  }

  renderRecordField(fieldConfig, record) {
    return (
      <Col key={fieldConfig.id} {...fieldConfig.props}>
        {record[fieldConfig.id]}
      </Col>
    );
  }

  renderOneRecord(record, index) {
    const oneRecord = this.props.parent.listsConfig[
      this.props.id
    ].listConfig.fields.map(item => this.renderRecordField(item, record));
    // 添加编辑link, 宽度固定为span=1
    oneRecord.push(
      <Col key={"edit"} span={1}>
        <a
          onClick={() => {
            this.editRecord(record);
          }}
        >
          编辑
        </a>
      </Col>
    );
    return <Row key={index}>{oneRecord}</Row>;
  }

  renderHeader() {
    return (
      <Row>
        {this.props.parent.listsConfig[this.props.id].listConfig.fields.map(
          item => this.renderHeaderField(item)
        )}
      </Row>
    );
  }

  renderBody() {
    return this.state.data.map((item, index) =>
      this.renderOneRecord(item, index)
    );
  }

  setApiUpdatedRecord(apiUrl, record) {
    console.log("setApiUpdatedRecord");
    // mock
    if (!record.id) {
      record.id = new Date().getTime();
    }

    this.addOrSet(record);
    this.hideModal();
  }

  setLocalUpdatedRecord(record) {
    if (!record.id) {
      // todo 在整张页面递交时, 需要把这些fakeid设置为0
      record.id = "fake" + new Date().getTime();
    }

    this.addOrSet(record);
    this.hideModal();
  }

  handleOk = () => {
    this.editForm.ppForm.props.form.validateFields((err, record) => {
      if (!err) {
        // 处理接受到的result(record信息), 直接调用save api或者先放入父级本地数据容器, 失败不要hideModel, 否则hideModel(如果是new的情况, 把从服务器得到的id填入record)
        if (this.props.saveApi) {
          // 由editForm直接调用api保存的情况
          this.setApiUpdatedRecord(this.props.saveApi, record);
        } else {
          this.setLocalUpdatedRecord(record);
        }
      }
    });
  };

  addOrSet(record) {
    // 这里没用setState, 页面的list数据也会更新显示, 因为modal消失后, PPList会forceUpdate
    const data = this.state.data;
    if (this.editForm.state.mode === "edit") {
      const index = data.findIndex(item => item.id == record.id);
      data[index] = record;
    } else if (this.editForm.state.mode === "new") {
      data.push({ ...record });
    }
  }

  handleCancel = () => {
    this.setState({
      showModal: false
    });
  };

  showModal = () => {
    this.setState({
      showModal: true
    });
  };

  hideModal = () => {
    this.setState({
      showModal: false
    });
  };

  editRecord(record) {
    this.setState({
      curData: record
    });
    this.showModal();
    // 等待modal中form加载完毕
    setTimeout(() => {
      this.editForm.setMode("edit");
    }, 100);
  }

  newRecord() {
    this.setState({
      curData: null
    });
    this.showModal();
    // 等待modal中form加载完毕
    setTimeout(() => {
      this.editForm.setMode("new");
    }, 100);
  }

  renderTop() {
    return (
      <div style={{ display: "flex", direction: "column" }}>
        <p>{this.props.title}</p>
        <a onClick={() => this.newRecord()}>
          <Icon
            type="plus"
            theme="outlined"
            style={{ position: "absolute", right: 20 }}
          />
        </a>
      </div>
    );
  }

  render() {
    return (
      <div>
        <Modal
          width={this.props.width ? this.props.width : 520}
          title={this.state.modalTitle}
          visible={this.state.showModal}
          destroyOnClose={true}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          // list中的editform save交给Modal的onOk去处理不能在这里用saveRecord
        >
          <CustomForm
            id="editForm"
            parent={this}
            ref={ref => (this.editForm = ref)}
            formConfig={this.formConfig}
            fieldsConfig={this.fieldsConfig}
            data={this.state.curData}
          />
        </Modal>
        {this.renderTop()}
        {this.renderHeader()}
        {this.renderBody()}
      </div>
    );
  }
}
