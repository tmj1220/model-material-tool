import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  ReactNode,
} from 'react';
import { Modal } from 'antd';
import type { ModalProps } from 'antd/es/modal';
import CloseSvg from '@/assets/images/anticons/close.svg';
import Icon from '@ant-design/icons';
import './index.less';

interface IProps extends ModalProps {
  title?: string;
  loading?: boolean;
  width?: number | string;
  modalConfirm?: () => void;
  modalCancel?: () => void;
  isShowFooter?: boolean;
  children?: ReactNode;
}
const commonModal = (
  {
    children,
    ...rest
  }: IProps,
  ref: React.Ref<unknown>,
) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const changeModalVisible = (payload: boolean) => {
    setModalVisible(payload);
  };
  useImperativeHandle(ref, () => ({
    changeModalVisible,
  }));
  return (
    <Modal
      style={{ top: 64, overflow: 'hidden' }}
      className="common-modal"
      maskClosable={false}
      keyboard={false}
      destroyOnClose
      closable={false}
      onCancel={() => changeModalVisible(false)}
      visible={modalVisible}
      footer={false}
      maskStyle={{
        background: 'rgba(250, 250, 250, 0.6)',
        backdropFilter: 'blur(40px)',
      }}
      {...rest}
    >
      <div className="content-box">
        <Icon className="modal-close" style={{ fontSize: 26 }} component={CloseSvg} />
        {children}
      </div>
    </Modal>
  );
};
export default forwardRef(commonModal);
