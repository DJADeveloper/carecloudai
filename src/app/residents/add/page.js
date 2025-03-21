const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    console.log("📝 Submitting resident data:", formData);

    // Validate required fields
    if (!formData.fullname || !formData.phone || !formData.dateofbirth || !formData.carelevel) {
      throw new Error("Please fill in all required fields");
    }

    // Format date of birth to match database expectations
    const formattedDOB = new Date(formData.dateofbirth).toISOString();

    const residentData = {
      fullname: formData.fullname,
      email: formData.email || null,
      phone: formData.phone,
      address: formData.address || null,
      dateofbirth: formattedDOB,
      carelevel: formData.carelevel,
      emergencycontactname: formData.emergencycontactname || null,
      emergencycontactphone: formData.emergencycontactphone || null,
      emergencycontactemail: formData.emergencycontactemail || null,
      bloodtype: formData.bloodtype || null,
      roomid: formData.roomid || null,
      familyid: formData.familyid || null,
      img: formData.img || null
    };

    console.log("🏥 Creating new resident with data:", residentData);

    const { data, error } = await createResident(residentData);

    if (error) {
      console.error("❌ Error creating resident:", error);
      throw error;
    }

    console.log("✅ Resident created successfully:", data);
    
    // Show success message
    setSuccess(true);
    
    // Reset form
    setFormData({
      fullname: '',
      email: '',
      phone: '',
      address: '',
      dateofbirth: '',
      carelevel: '',
      emergencycontactname: '',
      emergencycontactphone: '',
      emergencycontactemail: '',
      bloodtype: '',
      roomid: '',
      familyid: '',
      img: ''
    });

    // Redirect after a short delay
    setTimeout(() => {
      router.push('/residents');
    }, 2000);

  } catch (error) {
    console.error("❌ Error in handleSubmit:", error);
    setError(error.message || "An error occurred while creating the resident");
  } finally {
    setLoading(false);
  }
}; 