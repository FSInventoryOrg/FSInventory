import { Input } from '../ui/input';

const RequestorForm = () => {
  return (
    <>
      {/* Common Fields Section */}
      <div className="form-group">
        {/* autopopulate if logged in */}
        <label className="block text-sm font-medium pb-2">Full Name</label>
        <Input placeholder="John Doe" />
        {/* {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>} */}
      </div>

      <div className="form-group">
        {/* autopopulate if logged in */}
        <label className="block text-sm font-medium pb-2">Manager</label>
        <Input />
        {/* {errors.manager && <p className="text-red-500">{errors.manager.message}</p>} */}
      </div>

      <div className="form-group">
        <label className="block text-sm font-medium pb-2">
          Contact Information
        </label>
        <Input placeholder="johndoe@fullscale.ph or +63 912 345 6789" />
        {/* {errors.contactInfo && <p className="text-red-500">{errors.contactInfo.message}</p>} */}
      </div>
    </>
  );
};

export default RequestorForm;
