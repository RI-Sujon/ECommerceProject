using System.ComponentModel.DataAnnotations;

namespace Project.Object.Attributes
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field)]
    public class PasswordStrengthAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var password = value as string;
            if (string.IsNullOrEmpty(password))
                return ValidationResult.Success;   // [Required] handles null/empty

            var missing = new List<string>();
            if (!password.Any(char.IsUpper))
                missing.Add("one uppercase letter (A-Z)");
            if (!password.Any(char.IsLower))
                missing.Add("one lowercase letter (a-z)");
            if (!password.Any(char.IsDigit))
                missing.Add("one digit (0-9)");
            if (!password.Any(c => !char.IsLetterOrDigit(c)))
                missing.Add("one special character (!@#$%...)");

            return missing.Any()
                ? new ValidationResult("Password must contain at least: " + string.Join(", ", missing) + ".")
                : ValidationResult.Success;
        }
    }
}
