import React from "react";
import PropTypes from "prop-types";

const PrinterAddModal = React.memo(
  ({ formData, errors, onChange, onSubmit, campusOptions, buildingOptions, onClose }) => (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="text-lg font-bold mb-4">Thêm Máy In</h3>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="Model"
            placeholder="Model"
            className={`input input-bordered input-sm w-full ${
              errors.Model ? "border-red" : ""
            }`}
            value={formData.Model}
            onChange={onChange}
          />
          {errors.Model && <p className="text-red text-sm">{errors.Model}</p>}

          <input
            type="text"
            name="Brand"
            placeholder="Brand"
            className={`input input-bordered input-sm w-full ${
              errors.Brand ? "border-red" : ""
            }`}
            value={formData.Brand}
            onChange={onChange}
          />
          {errors.Brand && <p className="text-red text-sm">{errors.Brand}</p>}

          <select
            name="Status"
            className="select select-bordered select-sm w-full"
            value={formData.Status}
            onChange={onChange}
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="maintaining">Maintaining</option>
          </select>

          <select
            name="Campus"
            className={`select select-bordered select-sm w-full ${
              errors.Campus ? "border-red" : ""
            }`}
            value={formData.Campus}
            onChange={onChange}
          >
            <option value="" disabled>
              Select Campus
            </option>
            {campusOptions.map((campus) => (
              <option key={campus} value={campus}>
                {campus}
              </option>
            ))}
          </select>
          {errors.Campus && <p className="text-red text-sm">{errors.Campus}</p>}

          {formData.Campus && (
            <select
              name="Building"
              className={`select select-bordered select-sm w-full ${
                errors.Building ? "border-red" : ""
              }`}
              value={formData.Building}
              onChange={onChange}
            >
              <option value="" disabled>
                Select Building
              </option>
              {buildingOptions.map((block) => (
                <option key={block} value={block}>
                  {block}
                </option>
              ))}
            </select>
          )}
          {errors.Building && <p className="text-red text-sm">{errors.Building}</p>}

          <input
            type="number"
            name="Floor"
            placeholder="Floor"
            className={`input input-bordered input-sm w-full ${
              errors.Floor ? "border-red" : ""
            }`}
            value={formData.Floor}
            onChange={onChange}
          />
          {errors.Floor && <p className="text-red text-sm">{errors.Floor}</p>}

          <textarea
            name="Description"
            placeholder="Description"
            className={`textarea textarea-bordered w-full ${
              errors.Description ? "border-red" : ""
            }`}
            value={formData.Description}
            onChange={onChange}
          />
          {errors.Description && <p className="text-red text-sm">{errors.Description}</p>}
        </div>
        <div className="modal-action">
          <button className="btn btn-success text-white btn-sm" onClick={onSubmit}>
            Thêm
          </button>
          <button className="btn btn-sm btn-outline" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
);
PrinterAddModal.displayName = "PrinterAddModal";
PrinterAddModal.propTypes = {
  formData: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  campusOptions: PropTypes.array.isRequired,
  buildingOptions: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};
export default PrinterAddModal;